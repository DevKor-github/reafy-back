import { InvalidDateFormatException } from '../exception/statistics-service.exception';

export class DateUtilService {
  static checkDateFormatYYYYMMDD(dateString: string) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      throw InvalidDateFormatException(
        'Invalid date format. Date should be in YYYY-MM-DD format.',
      );
    }
  }

  static getDateYYYYMMDD(dateString: string): Date {
    this.checkDateFormatYYYYMMDD(dateString);
    return new Date(dateString + 'T00:00:00Z');
  }
}
