export class CustomDate {
  constructor(
    public year: number,
    public month: number, // 1-12
    public day: number
  ) {}

  // Créer à partir d'une chaîne YYYY-MM-DD
  static fromString(dateStr: string): CustomDate {
    const [year, month, day] = dateStr.split("-").map(Number);
    // Crée une date en heure locale pour éviter les conversions UTC
    const localDate = new Date(year, month - 1, day);
    return new CustomDate(
      localDate.getFullYear(),
      localDate.getMonth() + 1,
      localDate.getDate()
    );
  }

  // Créer à partir d'une date JavaScript
  static fromDate(date: Date): CustomDate {
    return new CustomDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  // Convertir en chaîne YYYY-MM-DD
  toString(): string {
    return `${this.year}-${String(this.month).padStart(2, "0")}-${String(
      this.day
    ).padStart(2, "0")}`;
  }

  // Convertir en format français DD/MM/YYYY
  toFrenchString(): string {
    return `${String(this.day).padStart(2, "0")}/${String(this.month).padStart(
      2,
      "0"
    )}/${this.year}`;
  }

  // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
  getDayOfWeek(): number {
    // Créer une date UTC
    const date = new Date(Date.UTC(this.year, this.month - 1, this.day));
    return date.getUTCDay();
  }

  // Comparer deux dates
  equals(other: CustomDate): boolean {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }

  // Vérifier si cette date est après une autre
  isAfter(other: CustomDate): boolean {
    if (this.year !== other.year) return this.year > other.year;
    if (this.month !== other.month) return this.month > other.month;
    return this.day > other.day;
  }

  // Vérifier si cette date est avant une autre
  isBefore(other: CustomDate): boolean {
    if (this.year !== other.year) return this.year < other.year;
    if (this.month !== other.month) return this.month < other.month;
    return this.day < other.day;
  }

  // Ajouter des jours
  addDays(days: number): CustomDate {
    const date = new Date(Date.UTC(this.year, this.month - 1, this.day + days));
    return CustomDate.fromDate(date);
  }

  // Soustraire des jours
  subtractDays(days: number): CustomDate {
    return this.addDays(-days);
  }

  // Obtenir le nombre de jours dans le mois
  static getDaysInMonth(year: number, month: number): number {
    // Utiliser UTC pour éviter les problèmes de fuseau horaire
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  // Obtenir aujourd'hui en UTC
  static today(): CustomDate {
    const now = new Date();
    return new CustomDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  // Convertir en Date JavaScript (UTC)
  toDate(): Date {
    return new Date(Date.UTC(this.year, this.month - 1, this.day));
  }
}
