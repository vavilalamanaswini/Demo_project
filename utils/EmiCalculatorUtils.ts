
export class EmiCalculatorUtils {
        static calculateEMI(principal: number, annualRate: number, years: number): number {
                const monthlyRate = annualRate / 12 / 100;
                const months = years * 12;
                const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
                return Math.ceil(emi);
        }
}

