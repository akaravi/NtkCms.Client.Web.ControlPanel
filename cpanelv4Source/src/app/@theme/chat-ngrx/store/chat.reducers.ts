import { Chat } from '../chat-ngrx.model';
import * as ChatActions from './chat.actions';

export interface FeatureState {
    chat: State;
}

export interface State {
    chat1: Chat[];
    chat2: Chat[];
    chat3: Chat[];
    chat4: Chat[];
    chat5: Chat[];
    chat6: Chat[];
    chat7: Chat[];
}

const initialState: State = {
    chat1: [
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
    ],
    chat2: [
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
    ],
    chat3: [
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
    ],
    chat4: [
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
    ],
    chat5: [
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
    ],
    chat6: [
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
    ],
    chat7: [
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
    ]

};

export function chatReducer(state = initialState, action: ChatActions.ChatActions) {
    switch (action.type) {       
        case (ChatActions.ADD_CHAT1):
            const chat1 = [...state.chat1];
            return {
                ...state,
                chat1: [...state.chat1, action.payload]
            };
        case (ChatActions.ADD_CHAT2):
            const chat2 = [...state.chat2];
            return {
                ...state,
                chat2: [...state.chat2, action.payload]
            };
        case (ChatActions.ADD_CHAT3):
            const chat3 = [...state.chat3];
            return {
                ...state,
                chat3: [...state.chat3, action.payload]
            };
        case (ChatActions.ADD_CHAT4):
            const chat4 = [...state.chat4];
            return {
                ...state,
                chat4: [...state.chat4, action.payload]
            };
        case (ChatActions.ADD_CHAT5):
            const chat5 = [...state.chat5];
            return {
                ...state,
                chat5: [...state.chat5, action.payload]
            };
        case (ChatActions.ADD_CHAT6):
            const chat6 = [...state.chat6];
            return {
                ...state,
                chat6: [...state.chat6, action.payload]
            };
        case (ChatActions.ADD_CHAT7):
            const chat7 = [...state.chat7];
            return {
                ...state,
                chat7: [...state.chat7, action.payload]
            };
        default:
            return state;
    }
}
