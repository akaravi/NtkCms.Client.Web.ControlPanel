import { Injectable } from '@angular/core';
import { Chat } from './chat.model';

@Injectable()
export class ChatService {

    constructor() { }

    // tslint:disable-next-line:member-ordering
    public chat1: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ],
            'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-3.png',
            '1 ساعت قبل',
            [
                'سلام خانم کاظمی، من به دنبال یکی از بهترین قالب های مدیریت هستم',
                'میشه کمکم کنی تا اینو پیدا کنم؟',
                'من دنبال قالب مدیریت با انگولار 8 هستم'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '30 دقیقه قبل',
            [
                'حتتتتتما!',
                'من بهت پیشنهاد میکنم که همینو بخر خیلی خوبه'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-3.png',
            '20 دقیقه قبل',
            [
                'میشه برام فایل صوتی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-3.png',
            '10 دقیقه قبل',
            [
                'میشه حالا برام فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-3.png',
            'همین حالا',
            [
                'به به ببین چه قالب تمیز و خوشگلیه',
                'این واسه پروژه بعدی من عالیه',
                'چطوری میتونم این قالبو خریداری کنم؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'ممنونم. از سایت راستچین'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-3.png',
            '',
            [
                'من برای اطمینان اینو ازت میخرم',
                'ممنونم.'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat2: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-7.png',
            '1 hours ago',
            [
                
                'اون به من چند راه برای حل مسئله ام معرفی کرد',
                'اما هیچکدوم به دردم نخورد'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '20 دقیقه قبل',
            [
                'میشه بجای متن برام فایل صوتی بفرستی'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-7.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '10 دقیقه قبل',
            [
                'میشه قوانین سایتو برام توی یک فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-7.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'I’m sorry to hear that',
                'Can I ask which model of projector you own?',
                'What steps did he suggest you to take?',
                'What sort of issue are you having?'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-7.png',
            '',
            [
                'An issue with the power.'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'Did you make sure the outlet you plugged it into was functional.'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-7.png',
            '',
            [
                'Yes'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat3: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-8.png',
            '1 hours ago',
            [
                'سلام خانم کاظمی، من به دنبال یکی از بهترین قالب های مدیریت هستم',
                'میشه کمکم کنی تا اینو پیدا کنم؟',
                'من دنبال قالب مدیریت با انگولار 8 هستم'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'حتتتتتما!',
                'من بهت پیشنهاد میکنم که همینو بخر خیلی خوبه'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-8.png',
            '20 دقیقه قبل',
            [
                'میشه برام فایل صوتی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-8.png',
            '10 دقیقه قبل',
            [
                'میشه حالا برام فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-8.png',
            '',
            [
                'به به ببین چه قالب تمیز و خوشگلیه',
                'این واسه پروژه بعدی من عالیه',
                'چطوری میتونم این قالبو خریداری کنم؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'ممنونم. از سایت راستچین'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-8.png',
            '',
            [
                'من برای اطمینان اینو ازت میخرم',
                'ممنونم.'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat4: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-5.png',
            '1 hours ago',
            [
                
                'اون به من چند راه برای حل مسئله ام معرفی کرد',
                'اما هیچکدوم به دردم نخورد'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '20 دقیقه قبل',
            [
                'میشه بجای متن برام فایل صوتی بفرستی'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-5.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '10 دقیقه قبل',
            [
                'میشه قوانین سایتو برام توی یک فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-5.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'I’m sorry to hear that',
                'Can I ask which model of projector you own?',
                'What steps did he suggest you to take?',
                'What sort of issue are you having?'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-5.png',
            '',
            [
                'An issue with the power.'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'Did you make sure the outlet you plugged it into was functional.'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-5.png',
            '',
            [
                'Yes'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat5: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-9.png',
            '1 hours ago',
            [
                'سلام خانم کاظمی، من به دنبال یکی از بهترین قالب های مدیریت هستم',
                'میشه کمکم کنی تا اینو پیدا کنم؟',
                'من دنبال قالب مدیریت با انگولار 8 هستم'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'حتتتتتما!',
                'من بهت پیشنهاد میکنم که همینو بخر خیلی خوبه'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-9.png',
            '20 دقیقه قبل',
            [
                'میشه برام فایل صوتی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-9.png',
            '10 دقیقه قبل',
            [
                'میشه حالا برام فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-9.png',
            '',
            [
                'به به ببین چه قالب تمیز و خوشگلیه',
                'این واسه پروژه بعدی من عالیه',
                'چطوری میتونم این قالبو خریداری کنم؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'ممنونم. از سایت راستچین'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-9.png',
            '',
            [
                'من برای اطمینان اینو ازت میخرم',
                'ممنونم.'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat6: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-4.png',
            '1 hours ago',
            [
                
                'اون به من چند راه برای حل مسئله ام معرفی کرد',
                'اما هیچکدوم به دردم نخورد'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '20 دقیقه قبل',
            [
                'میشه بجای متن برام فایل صوتی بفرستی'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-4.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '10 دقیقه قبل',
            [
                'میشه قوانین سایتو برام توی یک فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-4.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'I’m sorry to hear that',
                'Can I ask which model of projector you own?',
                'What steps did he suggest you to take?',
                'What sort of issue are you having?'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-4.png',
            '',
            [
                'An issue with the power.'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'Did you make sure the outlet you plugged it into was functional.'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-4.png',
            '',
            [
                'Yes'
            ]
            , 'text'),
    ];
    // tslint:disable-next-line:member-ordering
    public chat7: Chat[] = [
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'چطور میتونم بهتون کمک کنم؟'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-14.png',
            '1 hours ago',
            [
                'سلام خانم کاظمی، من به دنبال یکی از بهترین قالب های مدیریت هستم',
                'میشه کمکم کنی تا اینو پیدا کنم؟',
                'It should be angular 4 bootstrap compatible.'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'حتتتتتما!',
                'Apex admin is the responsive angular 4 bootstrap admin template.'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-14.png',
            '20 دقیقه قبل',
            [
                'میشه برام فایل صوتی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/audios/videogular.mp3'
            ]
            , 'audio'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-14.png',
            '10 دقیقه قبل',
            [
                'میشه حالا برام فایل ویدئویی بفرستی؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'http://static.videogular.com/assets/videos/videogular.mp4'
            ]
            , 'video'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-14.png',
            '',
            [
                'به به ببین چه قالب تمیز و خوشگلیه',
                'این واسه پروژه بعدی من عالیه',
                'چطوری میتونم این قالبو خریداری کنم؟'
            ]
            , 'text'),
        new Chat(
            'right',
            'chat',
            'assets/img/portrait/small/avatar-s-1.png',
            '',
            [
                'ممنونم. از سایت راستچین'
            ]
            , 'text'),
        new Chat(
            'left',
            'chat chat-left',
            'assets/img/portrait/small/avatar-s-14.png',
            '',
            [
                'من برای اطمینان اینو ازت میخرم',
                'ممنونم.'
            ]
            , 'text'),
    ];
}