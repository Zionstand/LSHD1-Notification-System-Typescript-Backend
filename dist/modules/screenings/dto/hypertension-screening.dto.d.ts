export declare class CreateHypertensionScreeningDto {
    screeningId: number;
    systolicBp1: number;
    diastolicBp1: number;
    position1: 'sitting' | 'standing' | 'lying';
    armUsed1: 'left' | 'right';
    systolicBp2?: number;
    diastolicBp2?: number;
    position2?: 'sitting' | 'standing' | 'lying';
    armUsed2?: 'left' | 'right';
    systolicBp3?: number;
    diastolicBp3?: number;
    position3?: 'sitting' | 'standing' | 'lying';
    armUsed3?: 'left' | 'right';
    screeningResult: 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';
    clinicalObservations?: string;
    recommendations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
    conductedById?: number;
}
export declare class UpdateHypertensionScreeningDto {
    screeningResult?: 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';
    systolicBp1?: number;
    diastolicBp1?: number;
    position1?: 'sitting' | 'standing' | 'lying';
    armUsed1?: 'left' | 'right';
    systolicBp2?: number;
    diastolicBp2?: number;
    position2?: 'sitting' | 'standing' | 'lying';
    armUsed2?: 'left' | 'right';
    systolicBp3?: number;
    diastolicBp3?: number;
    position3?: 'sitting' | 'standing' | 'lying';
    armUsed3?: 'left' | 'right';
    clinicalObservations?: string;
    recommendations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
}
