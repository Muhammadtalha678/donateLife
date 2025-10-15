export type Donor = {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    bloodType: string;
    dob: string;
    lastDonation?: string;
    eligibilityAge: string;
    eligibilityWeight: string;
    eligibilityTattoo: string;
    eligibilityHealth: string;
    createdAt: string;
};

export type BloodRequest = {
    id: string;
    userId: string;
    patientName: string;
    hospitalName: string;
    requiredBloodType: string;
    urgency: string;
    contactPerson: string;
    contactPhone: string;
    additionalInfo?: string;
    createdAt: string;
};
