import { Injectable } from '@angular/core';

@Injectable()
export class PeriodsService {
  getYears() {
    return [
      '1390', '1391', '1392',
      '1393', '1394', '1395',
      '1396', '1397', '1398',
    ];
  }

  getMonths() {
    return [
      'فرودین', 'اردیبهشت', 'خرداد',
      'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر',
      'دی', 'بهمن', 'اسفند',
    ];
  }

  getWeeks() {
    return [
      'شنبه',
      'یکشنبه',
      'دوشنبه',
      'سه شنبه',
      'چهارشنبه',
      'پنجشنبه',
      'جمعه',
    ];
  }
}
