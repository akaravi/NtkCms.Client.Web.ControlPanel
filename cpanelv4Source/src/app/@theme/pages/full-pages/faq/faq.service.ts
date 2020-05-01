import { Injectable } from '@angular/core';
import { FAQ } from './faq.model';

@Injectable()
export class FaqService {

    constructor() { }

    public faqs: FAQ[] = [
        new FAQ(
            1,
            'چگونه سرویس دیتای سیم کارت خود را فعال کنیم؟',
            `Aenean eget leo vel lorem tincidunt tempor sit amet non ex.
             Aenean porta, velit ut efficitur fringilla, enim est suscipit augue.`,
        ),
        new FAQ(
            2,
            'چگونه تنظیمات اینترنت نوترینو را بر روی گوشی دریافت نماییم؟',
            `Nam tincidunt rhoncus dolor nec imperdiet. Ut ut mauris tortor. Nulla cursus mattis elit, sed egestas augue laoreet id.`,
        ),
        new FAQ(
            3,
            'چگونه می توانم از فعال بودن سرویس اینترنت گوشی خود مطمئن شوم؟',
            `Aenean eget leo vel lorem tincidunt tempor sit amet non ex.
            Aenean porta, velit ut efficitur fringilla, enim est suscipit augue.`,
        ),
        new FAQ(
            4,
            'کدام مناطق تحت پوشش اینترنت نوترینوی همراه اول می باشد؟',
            `Nam tincidunt rhoncus dolor nec imperdiet. Ut ut mauris tortor. Nulla cursus mattis elit.`,
        ),
        new FAQ(
            5,
            'برای کاهش هزینه سرویس دیتا چه راهکاری وجود دارد؟',
            `Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. `,
        ),
        new FAQ(
            6,
            'چگونه می توان تمدید خودکار بسته های نوترینو را لغو نمود؟',
            `Sed sit amet feugiat mi. Morbi dui dui, ultrices id commodo in, commodo ut erat.`,
        ),
        new FAQ(
            7,
            'آیا همراه اول بسته های اینترنت شبانه ارائه می دهد؟',
            `Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et .`,
        ),
        new FAQ(
            8,
            'در زمان اتصال به سرویس اینترنت نوترینو، هزینه اتصال بر چه مبنایی محاسبه می شود؟',
            `Sed sit amet feugiat mi. Morbi dui dui, ultrices id commodo in, commodo ut erat. Ut vitae condimentum lorem.`,
        ),
        new FAQ(
            9,
            'آیا با تغییر نام سیم کارت، سرویس اینترنت نوترینو قطع می گردد؟',
            `Vivamus eu consectetur dui. Pellentesque eu mi et lacus mollis tempor. Etiam sed lobortis sapien. Mauris ultrices.`,
        ),
        new FAQ(
            10,
            'چه شرایطی برای فعال سازی و استفاده از اینترنت نسل ۴ (4G) بر روی سیم کارت لازم است؟',
            `Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor. Donec mollis eleifend auctor.`,
        ),
        new FAQ(
            11,
            'چگونه می توان از سرعت اینترنت نوترینوی سیم کارت خود مطلع شوم؟',
            `Vivamus eu consectetur dui. Pellentesque eu mi et lacus mollis tempor. Etiam sed lobortis sapien. Mauris ultrices bibendum elit, at egestas felis elementum vitae. Mauris viverra nulla vitae pulvinar sollicitudin.
             `,
        ),
        new FAQ(
            12,
            'چگونه تنظیمات اینترنت نوترینو را بر روی گوشی دریافت نماییم؟',
            `Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor. Donec mollis eleifend auctor. Aliquam arcu erat `,
        ),
        new FAQ(
            13,
            'تعرفه عادی اینترنت نوترینو چه میزان می باشد؟',
            `Aenean eget leo vel lorem tincidunt tempor sit amet non ex.
            Phasellus ut odio in dolor eleifend tincidunt eget id tellus.`,
        ),
        new FAQ(
            14,
            'چگونه نوع پوشش شبکه در مناطق مختلف را می توان تشخیص داد؟',
            `Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor.
             Ut sed viverra neque, nec hendrerit tortor. `,
        ),
        new FAQ(
            15,
            'آیا پس از اتمام بسته های نوترینو، مصرف بعدی اینترنت با هزینه بیشتری محاسبه می گردد؟',
            `Enim est suscipit augue, in porta ex nisi quis est.
            Phasellus ut odio in dolor eleifend tincidunt eget id tellus.`,
        ),

    ]
}
