import { Injectable } from '@angular/core';
import { Mail, Message, MessageDetail, Attachments } from './inbox.model';

@Injectable()
export class InboxService {

    constructor() { }

    // tslint:disable-next-line:member-ordering
    public inbox: Mail[] = [
        new Mail(
            1,
            'تونی دیپ',
            'سلام.. بالاخره پیدات کردم..!',
            'من حالم خیلی خوبه تو چی',
            '4:14 صبح',
            false,
            true,
            false,
            false,
            '',
            'T',
            'bg-info',
            'Inbox',
            true,
            'خانواده',
            'badge badge-danger mr-1',
            false
        ),
        new Mail(
            2,
            'لوییس ویلی',
            'ممنونم. اجازه بده که ما انجامش بدیم',
            'میشه امروز باهم وصل بشیم...',
            '2:15 صبح',
            false,
            false,
            true,
            false,
            '',
            'L',
            'bg-danger',
            'Inbox',
            false,
            '',
            '',
            false
        ),
        new Mail(
            3,
            'راستچین',
            'شما یک دیدگاه جدید دارید...',
            'سلام فاطمه کاظمی...',
            '11:18 بعداز ظهر',
            false,
            false,
            false,
            false,
            '',
            'E',
            'bg-warning',
            'Inbox',
            true,
            'کاری',
            'badge badge-warning mr-1',
            false
        ),
        new Mail(
            4,
            'وانی بارتون',
            'وضعیت شروع پروژه...',
            'سلام. میتونم امروز شمارو ببینم...',
            'امروز',
            true,
            true,
            false,
            true,
            'assets/img/portrait/small/avatar-s-7.png',
            '',
            '',
            'Inbox',
            true,
            'شخصی',
            'badge badge-success mr-1',
            true
        ),
        new Mail(
            5,
            'سارا مونتگومری',
            'طرح بندی جدید سایتو.',
            'همه چی به نظر خوب میاد',
            'دیروز',
            true,
            true,
            false,
            true,
            'assets/img/portrait/small/avatar-s-5.png',
            '',
            '',
            'Inbox',
            true,
            'دوستان',
            'badge badge-primary mr-1',
            false
        ),
        new Mail(
            6,
            'هادر هاول',
            'ممنونم. اجازه بده که ما انجامش بدیم',
            'میشه امروز باهم وصل بشیم...',
            '15  خرداد',
            true,
            false,
            true,
            false,
            '',
            'H',
            'bg-success',
            'Inbox',
            false,
            '',
            '',
            false
        ),
        new Mail(
            7,
            'کلی رایز',
            'I paid it, ممنونم.',
            'Check once...',
            '12  خرداد',
            false,
            false,
            true,
            true,
            'assets/img/portrait/small/avatar-s-8.png',
            '',
            '',
            'Inbox',
            true,
            'کاری',
            'badge badge-warning mr-1',
            false
        ),
        new Mail(
            8,
            'وینسنت نلسون',
            'تو کجایی فاطمه؟',
            'امشب به مهمانی می آیی؟',
            '11  خرداد',
            true,
            false,
            false,
            false,
            '',
            'V',
            'bg-warning',
            'Sent',
            true,
            'دوستان',
            'badge badge-primary mr-1',
            false
        ),
        new Mail(
            9,
            'الیزابت الیوت',
            'Okay, I will call you.',
            'Here they are.',
            '8  خرداد',
            true,
            false,
            false,
            false,
            '',
            'E',
            'bg-info',
            'Sent',
            false,
            '',
            '',
            false
        ),
        new Mail(
            10,
            'سارا مونتگومری',
            'طرح بندی جدید سایتو.',
            'همه چی به نظر خوب میاد',
            'دیروز',
            true,
            true,
            true,
            true,
            'assets/img/portrait/small/avatar-s-6.png',
            '',
            '',
            'Sent',
            true,
            'کاری',
            'badge badge-warning mr-1',
            false
        ),
        new Mail(
            11,
            'هادر هاول',
            'ممنونم. اجازه بده که ما انجامش بدیم',
            'میشه امروز باهم وصل بشیم...',
            '15  خرداد',
            true,
            true,
            false,
            false,
            '',
            'H',
            'bg-success',
            'Sent',
            true,
            'شخصی',
            'badge badge-success mr-1',
            false
        ),
        new Mail(
            12,
            'کلی رایز',
            'I paid it, ممنونم.',
            'Check once...',
            '12  خرداد',
            false,
            false,
            true,
            true,
            'assets/img/portrait/small/avatar-s-8.png',
            '',
            '',
            'Trash',
            true,
            'کاری',
            'badge badge-warning mr-1',
            false
        ),
        new Mail(
            13,
            'وینسنت نلسون',
            'تو کجایی فاطمه؟',
            'امشب به مهمانی می آیی؟',
            '11  خرداد',
            true,
            false,
            false,
            false,
            '',
            'V',
            'bg-warning',
            'Trash',
            true,
            'دوستان',
            'badge badge-primary mr-1',
            false
        ),
        new Mail(
            14,
            'الیزابت الیوت',
            'Okay, I will call you.',
            'Here they are.',
            '8  خرداد',
            true,
            false,
            false,
            false,
            '',
            'E',
            'bg-info',
            'Trash',
            false,
            '',
            '',
            false
        ),
    ];

    // tslint:disable-next-line:member-ordering
    public message: Message[] = [
        new Message(
            1,
            'سلام.. بالاخره پیدات کردم..!',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'تونی دیپ',
                    `<p>Hi Tonny,</p>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                     <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                     <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                     <p>Regards,<br/>John</p>`,
                    '12  خرداد',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'تونی دیپ',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    'امروز',
                    false,
                    false,
                    false,
                    '',
                    'T',
                    'bg-info',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            2,
            'ممنونم. اجازه بده که ما انجامش بدیم',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'لوییس ویلی',
                    `<p>سلام لوییس</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '15 فروردین',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'لوییس ویلی',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    '2:15 صبح',
                    false,
                    true,
                    false,
                    '',
                    'L',
                    'bg-danger',
                    [
                        new Attachments(
                            1,
                            'assets/img/gallery/1.jpg'
                        ),
                        new Attachments(
                            2,
                            'assets/img/gallery/3.jpg'
                        ),
                        new Attachments(
                            3,
                            'assets/img/gallery/21.jpg'
                        )
                    ]
                ),
            ]
        ),
        new Message(
            3,
            'شما دیدگاه های جدید دارید ...',
            1,
            [
                new MessageDetail(
                    '1',
                    'راستچین',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    '11:18 بعداز ظهر',
                    false,
                    false,
                    false,
                    '',
                    'E',
                    'bg-warning',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            4,
            'Project ABC Status Report',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'وانی بارتون',
                    `<p>Hi Wayne,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '12  خرداد',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'وانی بارتون',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    'امروز',
                    false,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-7.png',
                    '',
                    '',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            5,
            'Your New UI',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'سارا مونتگومری',
                    `<p>Hi Sarah,</p>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                     <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                     <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                     <p>Regards,<br/>John</p>`,
                    '12  خرداد',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'سارا مونتگومری',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    'دیروز',
                    false,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-5.png',
                    '',
                    '',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            6,
            'ممنونم. اجازه بده که ما انجامش بدیم',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'هادر هاول',
                    `<p>Hi Heather,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '13 May',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'هادر هاول',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    '15  خرداد',
                    false,
                    true,
                    false,
                    '',
                    'H',
                    'bg-success',
                    [
                        new Attachments(
                            1,
                            'assets/img/gallery/16.jpg'
                        ),
                        new Attachments(
                            2,
                            'assets/img/gallery/17.jpg'
                        )
                    ]
                ),
            ]
        ),
        new Message(
            7,
            'I paid it, ممنونم.',
            1,
            [
                new MessageDetail(
                    '1',
                    'کلی رایز',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    '12  خرداد',
                    false,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-8.png',
                    '',
                    '',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            8,
            'تو کجایی فاطمه؟',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'وینسنت نلسون',
                    `<p>Hi Vincent,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '12 August',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'وینسنت نلسون',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    '11  خرداد',
                    false,
                    false,
                    false,
                    '',
                    'V',
                    'bg-warning',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            9,
            'Okay, I will call you.',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'الیزابت الیوت',
                    `<p>Hi Elizabeth,</p>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                     <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                     <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                     <p>Regards,<br/>John</p>`,
                    '31 May',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'الیزابت الیوت',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    '8  خرداد',
                    false,
                    false,
                    false,
                    '',
                    'E',
                    'bg-info',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            10,
            'طرح بندی جدید سایتو.',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'سارا مونتگومری',
                    `<p>Hi Sarah,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '15 فروردین',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'سارا مونتگومری',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    'دیروز',
                    false,
                    true,
                    true,
                    'assets/img/portrait/small/avatar-s-6.png',
                    '',
                    '',
                    [
                        new Attachments(
                            1,
                            'assets/img/gallery/1.jpg'
                        ),
                        new Attachments(
                            2,
                            'assets/img/gallery/3.jpg'
                        ),
                        new Attachments(
                            3,
                            'assets/img/gallery/21.jpg'
                        )
                    ]
                ),
            ]
        ),
        new Message(
            11,
            'ممنونم. اجازه بده که ما انجامش بدیم',
            1,
            [
                new MessageDetail(
                    '1',
                    'هادر هاول',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    '15  خرداد',
                    false,
                    false,
                    false,
                    '',
                    'H',
                    'bg-success',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            12,
            'I paid it, ممنونم.',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'کلی رایز',
                    `<p>Hi Kelly,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '12  خرداد',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'کلی رایز',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    'امروز',
                    false,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-8.png',
                    '',
                    '',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            13,
            'تو کجایی فاطمه؟',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'وینسنت نلسون',
                    `<p>Hi Vincent,</p>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                     <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                     <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                     <p>Regards,<br/>John</p>`,
                    '21  خرداد',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'وینسنت نلسون',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                     <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                     <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                     <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                     <p>با امید موفقیت روز افزون..</p>`,
                    '11  خرداد',
                    false,
                    false,
                    false,
                    '',
                    'V',
                    'bg-warning',
                    [
                    ]
                ),
            ]
        ),
        new Message(
            14,
            'Okay, I will call you.',
            2,
            [
                new MessageDetail(
                    '1',
                    'فاطمه کاظمی زاده',
                    'الیزابت الیوت',
                    `<p>Hi Elizabeth,</p>
                    <p>لورم ایپسوم متن ساختگی با تولید نامفهوم که در صنعت چاپ و عکاسی برای ساخت متون بی معنی و مفهوم به کار می رود.</p> 
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
                    <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
                    <p>Regards,<br/>John</p>`,
                    '15 فروردین',
                    true,
                    false,
                    true,
                    'assets/img/portrait/small/avatar-s-1.png',
                    '',
                    '',
                    [
                    ]
                ),
                new MessageDetail(
                    '2',
                    'الیزابت الیوت',
                    'من',
                    `<p>سلام خانم کاظمی،</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna quam, rhoncus vitae lacinia vitae, gravida eleifend urna. Sed mattis posuere urna, iaculis ornare mi ultrices rhoncus. Phasellus elementum suscipit ante eu consectetur</p>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim nisi, bibendum at tincidunt vel, aliquam a mi. Vivamus non interdum nisi, at bibendum arcu. Integer sagittis, erat in imperdiet aliquam, erat sem mollis enim, nec tincidunt lectus sapien a diam. Pellentesque pulvinar sit amet nunc ac mattis</p>
                    <p>Ut sagittis dictum metus, dapibus faucibus risus facilisis sed. Vivamus scelerisque arcu vel dolor aliquet, vitae molestie risus dignissim. Donec id odio interdum, ornare nisl ac, mattis sem. Curabitur id magna nunc</p>
                    <p>با امید موفقیت روز افزون..</p>`,
                    '8  خرداد',
                    false,
                    true,
                    false,
                    '',
                    'E',
                    'bg-info',
                    [
                        new Attachments(
                            1,
                            'assets/img/gallery/1.jpg'
                        ),
                        new Attachments(
                            2,
                            'assets/img/gallery/3.jpg'
                        ),
                        new Attachments(
                            3,
                            'assets/img/gallery/21.jpg'
                        )
                    ]
                ),
            ]
        )
    ];



}