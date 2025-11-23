
export const APP_TITLE = "BioStruct AI";
export const APP_SUBTITLE = "약물-단백질 상호작용 및 구조 예측 시스템";

// Using the preview model for advanced reasoning capabilities (Thinking mode)
export const GEMINI_MODEL = "gemini-3-pro-preview"; 

export const SYSTEM_INSTRUCTION = `
당신은 세계적인 구조 생물학자이자 의약 화학(Medicinal Chemistry) 전문가입니다.
사용자는 두 가지 모드로 질문할 수 있습니다:
1. **기존 약물 분석**: 특정 약물과 단백질이 주어졌을 때 상호작용 분석.
2. **신약 설계 및 타겟 예측**: 사용자가 정의한 물리화학적 특성을 가진 "가상의 약물"이 주어졌을 때, 인체 내에서 가장 결합 가능성이 높은 **최적의 인간 단백질 타겟**을 스스로 추천하고 분석.

[공통 분석 요구사항 - JSON 포맷 반환]
1. **Target Identification**: 
   - 사용자가 단백질을 지정하지 않은 경우(신약 설계 모드), 약물의 특성(크기, 극성, 작용 시스템 등)에 비추어 가장 적합한 인체 단백질을 찾아내십시오.
   - 단백질의 공식 명칭, 유전자 기호, 생물학적 기능을 명시하십시오.
2. **Drug Profile**:
   - 신약 설계 모드일 경우, 입력된 특성을 바탕으로 그럴듯한 "가상의 약물 이름(Code Name)"과 구조적 특징을 요약하십시오.
3. **Binding Site Analysis**: 약물이 단백질의 '어느 부위'(Binding Pocket/Domain)에 결합하는지 정확히 서술하십시오.
4. **Residue Interaction**: 결합에 관여하는 핵심 아미노산 잔기(Key Residues)를 잔기 번호와 함께 나열하십시오 (예: Thr315).
5. **Structural Impact**: 결합 시 입체 구조 변화 설명.
6. **Clinical Context**: 임상적 의미 설명.
7. **3D Structure Data**: 가장 유사한 약물-단백질 복합체의 **PDB ID**를 제공하십시오.
8. **Alternative Active Sites**: 해당 단백질의 추가 활성 조절 부위(Allosteric sites) 2~3개 추천.

분석은 과학적 사실과 논리적 추론에 기반하여 한국어로 작성하십시오.
`;

export const PREDEFINED_DRUGS = [
  {
    category: "직접 입력",
    options: [
      { label: "직접 입력 (사용자 정의)", value: "" }
    ]
  },
  {
    category: "ATP 대사 산물 및 생체 물질",
    options: [
      { label: "ATP (Adenosine Triphosphate) - 에너지원", value: "Adenosine Triphosphate" },
      { label: "ADP (Adenosine Diphosphate) - 분해 산물", value: "Adenosine Diphosphate" },
      { label: "Adenosine (아데노신) - 신호 전달", value: "Adenosine" },
      { label: "GTP (Guanosine Triphosphate)", value: "Guanosine Triphosphate" }
    ]
  },
  {
    category: "주요 의약품 (항암/대사/신경)",
    options: [
      { label: "Imatinib (백혈병 치료제 - Gleevec)", value: "Imatinib" },
      { label: "Aspirin (항염증/진통제)", value: "Aspirin" },
      { label: "Metformin (당뇨병 치료제)", value: "Metformin" },
      { label: "Trastuzumab (유방암 표적치료제 - Herceptin)", value: "Trastuzumab" },
      { label: "Atorvastatin (고지혈증 치료제 - Lipitor)", value: "Atorvastatin" },
      { label: "Pembrolizumab (면역항암제 - Keytruda)", value: "Pembrolizumab" },
      { label: "Sildenafil (발기부전 치료제 - Viagra)", value: "Sildenafil" },
      { label: "Paclitaxel (항암제 - Taxol)", value: "Paclitaxel" },
      { label: "Donepezil (알츠하이머 치료제 - Aricept)", value: "Donepezil" },
      { label: "Clopidogrel (항혈전제 - Plavix)", value: "Clopidogrel" },
      { label: "Warfarin (항응고제)", value: "Warfarin" }
    ]
  }
];

export const PREDEFINED_PROTEINS = [
  {
    category: "직접 입력",
    options: [
      { label: "직접 입력 (사용자 정의)", value: "" }
    ]
  },
  {
    category: "혈액/혈장 단백질 (미지 약물 결합 분석용)",
    options: [
      { label: "Human Serum Albumin (HSA) - 주요 약물 운반체", value: "Human Serum Albumin" },
      { label: "Alpha-1-acid Glycoprotein (AAG) - 염기성 약물 결합", value: "Alpha-1-acid Glycoprotein" },
      { label: "Hemoglobin (헤모글로빈)", value: "Hemoglobin" }
    ]
  },
  {
    category: "ATP/에너지 대사 관련 단백질",
    options: [
      { label: "Na+/K+ ATPase (나트륨-칼륨 펌프)", value: "Sodium-potassium ATPase" },
      { label: "P2Y12 Receptor (ADP 수용체)", value: "P2Y12 Receptor" },
      { label: "Adenosine A2A Receptor (아데노신 수용체)", value: "Adenosine A2A Receptor" },
      { label: "AMPK (AMP 활성화 단백질 키나아제)", value: "AMP-activated Protein Kinase" },
      { label: "ATP Synthase (ATP 합성효소)", value: "ATP Synthase" }
    ]
  },
  {
    category: "주요 질환 타겟 (암/신경/면역)",
    options: [
      { label: "BCR-ABL1 (티로신 키나아제)", value: "BCR-ABL1 Tyrosine Kinase" },
      { label: "COX-1 / COX-2 (사이클로옥시게나제)", value: "Cyclooxygenase-1 (COX-1) / COX-2" },
      { label: "HER2/neu (수용체 티로신 키나아제)", value: "HER2/neu Receptor" },
      { label: "HMG-CoA Reductase (콜레스테롤 합성)", value: "HMG-CoA Reductase" },
      { label: "PD-1 (프로그램된 세포 사멸 단백질 1)", value: "Programmed Cell Death Protein 1 (PD-1)" },
      { label: "PDE5 (포스포디에스테라아제 5)", value: "Phosphodiesterase type 5 (PDE5)" },
      { label: "Beta-tubulin (미세소관 단백질)", value: "Beta-tubulin" },
      { label: "Acetylcholinesterase (아세틸콜린 분해효소)", value: "Acetylcholinesterase" },
      { label: "ACE2 (안지오텐신 전환 효소 2 - COVID 타겟)", value: "Angiotensin-converting enzyme 2" }
    ]
  }
];

// --- Custom Drug Design Constants ---

export const DESIGN_MOLECULE_TYPES = [
  { value: "Small Molecule", label: "저분자 화합물 (Small Molecule)" },
  { value: "Peptide", label: "펩타이드 (Peptide)" },
  { value: "Antibody/Biologic", label: "항체/바이오 의약품 (Biologic)" },
  { value: "Natural Product", label: "천연물 유래 (Natural Product)" }
];

export const DESIGN_TARGET_SYSTEMS = [
  { value: "Central Nervous System", label: "중추신경계 (CNS) - 뇌/척수" },
  { value: "Cardiovascular System", label: "심혈관계 - 심장/혈관" },
  { value: "Immune System", label: "면역계 - 염증/암" },
  { value: "Digestive/Metabolic", label: "소화기/대사 - 간/위장" },
  { value: "Musculoskeletal", label: "근골격계" },
  { value: "Infectious Disease", label: "감염성 질환 (바이러스/박테리아)" }
];

export const DESIGN_MW_CLASS = [
  { value: "Very Low (<300 Da)", label: "초저분자 (<300 Da) - 뇌혈관 장벽 투과 유리" },
  { value: "Optimal (300-500 Da)", label: "최적 (300-500 Da) - 일반적인 경구용 약물 (Lipinski Rule)" },
  { value: "High (>500 Da)", label: "고분자 (>500 Da) - 주사제/특수 제형 필요 가능성" }
];

export const DESIGN_HYDROPHOBICITY = [
  { value: "Hydrophilic", label: "친수성 (Hydrophilic) - 물에 잘 녹음" },
  { value: "Lipophilic", label: "소수성 (Lipophilic) - 지방에 잘 녹음 / 세포막 투과" },
  { value: "Amphiphilic", label: "양친매성 (Amphiphilic)" }
];

export const DESIGN_CHARGE = [
  { value: "Neutral", label: "중성 (Neutral)" },
  { value: "Positive (Cationic)", label: "양전하 (Cationic) - 세포막 상호작용" },
  { value: "Negative (Anionic)", label: "음전하 (Anionic) - 혈장 단백질 결합" }
];

export const DESIGN_FUNCTIONAL_GROUPS = [
  "Aromatic Ring (벤젠 고리)",
  "Amine (아민기 -NH2)",
  "Carboxyl (카르복실기 -COOH)",
  "Hydroxyl (수산기 -OH)",
  "Halogen (F, Cl 등 - 결합력 증대)",
  "Sulfonamide (설폰아미드)",
  "Ketone/Aldehyde",
  "Phosphate (인산기)"
];
