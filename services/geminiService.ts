
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";
import { InteractionAnalysis, AnalysisMode, CustomDrugParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInteraction = async (
  drugInput: string,
  proteinInput: string,
  mode: AnalysisMode = 'existing',
  customParams?: CustomDrugParams
): Promise<InteractionAnalysis> => {
  try {
    let prompt = "";

    if (mode === 'custom' && customParams) {
      // Build prompt for Custom Drug Design Mode
      const functionalGroups = customParams.functionalGroups.length > 0 
        ? customParams.functionalGroups.join(", ") 
        : "특별한 작용기 없음";

      prompt = `
      [신약 설계 및 타겟 예측 요청]
      사용자가 다음과 같은 물리화학적 특성을 가진 "가상의 미지 약물(Unknown Drug)"을 설계했습니다.
      
      1. 분자 종류: ${customParams.moleculeType}
      2. 타겟 시스템: ${customParams.targetSystem}
      3. 분자량: ${customParams.molecularWeight}
      4. 소수성/친수성(LogP): ${customParams.hydrophobicity}
      5. 전하(Charge): ${customParams.charge}
      6. 주요 작용기: ${functionalGroups}

      [분석 지시사항]
      1. 위 특성을 모두 만족하는 그럴듯한 약물의 이름(Code Name)과 화학적 구조를 가정하여 설명하십시오.
      2. 이 약물이 인체 ${customParams.targetSystem} 내에서 결합할 가능성이 가장 높은 **실존하는 인간 단백질 타겟**을 하나 추천하십시오.
      3. 해당 단백질과 이 가상의 약물 간의 결합 부위 및 구조적 상호작용을 예측 분석하십시오.
      `;
    } else {
      // Existing Drug Mode
      prompt = `
      다음 약물과 단백질에 대한 정밀 구조 분석을 수행해 주세요.
      
      1. 약물 (Drug): ${drugInput}
      2. 타겟 단백질 (Protein/Target): ${proteinInput}
      
      [분석 요구사항]
      - 이 약물이 결합하는 단백질이 무엇인지 정확히 식별하세요.
      - 약물이 단백질의 '어느 부위(Binding Site)'에 결합하는지 구체적으로 명시하세요.
      - 데이터베이스(PDB 등)에 기반하여 결합 구조 및 관련 잔기(Residues)를 예측하세요.
      - 실제 PDB 데이터베이스에 존재하는 이 복합체의 대표적인 PDB ID(4자리 코드)를 찾아내세요.
      - 이 단백질의 기능을 조절할 수 있는 다른 잠재적 부위(Allosteric site 등)를 제안하세요.
      `;
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2048 }, // Use thinking budget for deep scientific reasoning
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proteinName: { type: Type.STRING, description: "식별된(또는 예측된) 단백질의 정확한 명칭" },
            proteinFunction: { type: Type.STRING, description: "해당 단백질의 생물학적/생리학적 기능" },
            drugName: { type: Type.STRING, description: "분석된 약물의 명칭 (가상 약물일 경우 생성된 이름)" },
            bindingSiteDescription: { type: Type.STRING, description: "약물이 결합하는 정확한 위치" },
            residuesInvolved: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "결합 부위를 구성하는 주요 아미노산 잔기 목록 (반드시 번호 포함)" 
            },
            structuralChanges: { type: Type.STRING, description: "약물 결합이 유도하는 구조적 변화" },
            bindingAffinityPrediction: { type: Type.STRING, description: "예측되는 결합 친화도" },
            clinicalSignificance: { type: Type.STRING, description: "이 결합의 임상적/치료적 의미" },
            pdbId: { type: Type.STRING, description: "대표적인 PDB ID (없으면 빈 문자열)" },
            alternativeBindingSites: {
              type: Type.ARRAY,
              description: "추가적인 잠재적 결합 부위 목록",
              items: {
                type: Type.OBJECT,
                properties: {
                  siteName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mechanism: { type: Type.STRING }
                }
              }
            }
          },
          required: ["proteinName", "proteinFunction", "drugName", "bindingSiteDescription", "residuesInvolved", "structuralChanges", "clinicalSignificance", "alternativeBindingSites"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(text) as InteractionAnalysis;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
