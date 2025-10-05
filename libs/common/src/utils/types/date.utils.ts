export class DateUtils {
  /**
   * Add hour to a date
   */
  static addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }

  /**
   * Substract hours from a date
   */
  static substractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }

  /**
   * Add minutes to date
   */
  static addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  /**
   * Substract minutes from a date
   */
  static substractMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - minutes);
    return newDate;
  }

  /**
   * Add milliseconds to date
   */
  static addMillis(date: Date, millis: number): Date {
    const newDate = new Date(date);
    newDate.setMilliseconds(newDate.getMilliseconds() + millis);
    return newDate;
  }

  /**
   * Substract milliseconds from a date
   */
  static substractMillis(date: Date, millis: number): Date {
    const newDate = new Date(date);
    newDate.setMilliseconds(newDate.getMilliseconds() - millis);
    return newDate;
  }

  /**
   * Compute difference between two dates in hours
   */
  static diffHours(date1: Date, date2: Date): number {
    let diff = (date1.getTime() - date2.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  /**
   * Compute difference between two dates in milliseconds
   */
  static diffMillis(date1: Date, date2: Date): number {
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff);
  }

  /**
   * Compute difference between two dates in days
   */
  static diffDays(date1: Date | string, date2: Date | string) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    firstDate.setHours(0, 0, 0, 0);
    secondDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(firstDate.getTime() - secondDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Format a date to YYYY-MM-DD string
   */
  static format(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format a date to human readable string
   */
  static formatHuman(date: Date | string, locale = 'fr') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  }

  /**
   * Validate a date string in YYYY-MM-DD format
   */
  static isValid(dateString: string = ''): boolean {
    // Verify format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  /**
   * Check if target date is before source date
   */
  static isBefore(
    targetDate: string | Date,
    sourceDate: string | Date,
    ignoreTime: boolean = true,
  ): boolean {
    return this.#compare(targetDate, sourceDate, 'lt', ignoreTime);
  }

  /**
   * Check if target date is after source date
   */
  static isAfter(
    targetDate: string | Date,
    sourceDate: string | Date,
    ignoreTime: boolean = true,
  ): boolean {
    return this.#compare(targetDate, sourceDate, 'gt', ignoreTime);
  }

  /**
   * Check if target date is equal to source date
   */
  static isEqual(
    targetDate: string | Date,
    sourceDate: string | Date,
    ignoreTime: boolean = true,
  ): boolean {
    return this.#compare(targetDate, sourceDate, 'eq', ignoreTime);
  }

  /**
   * Compare two dates
   */
  static #compare(
    targetDate: string | Date,
    sourceDate: string | Date,
    operator: 'lt' | 'eq' | 'gt',
    ignoreTime: boolean = true,
  ): boolean {
    const target = new Date(targetDate);
    const source = new Date(sourceDate);

    if (ignoreTime) {
      target.setHours(0, 0, 0, 0);
      source.setHours(0, 0, 0, 0);
    }

    if (operator === 'lt') {
      return target < source;
    }

    if (operator === 'gt') {
      return target > source;
    }

    return target.getTime() === source.getTime();
  }
}
