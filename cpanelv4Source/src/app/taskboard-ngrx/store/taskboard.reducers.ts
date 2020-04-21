import { Task } from '../taskboard-ngrx.model';
import * as TaskActions from './taskboard.actions';

export interface FeatureState {
    task: State;
}

export interface State {
    todo: Task[];
    inProcess: Task[];
    backLog: Task[];
    completed: Task[];
}

const initialState: State = {
    todo: [
        new Task(
            'ریسپانسیو',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'بهمن 17',
            'الیزابت الیوت',
            'assets/img/portrait/small/avatar-s-3.png',
            'جدید'),
        new Task(
            'تست دیتابیس',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'بهمن 17',
            'الیزابت الیوت',
            'assets/img/portrait/small/avatar-s-3.png',
            'جدید'),
        new Task(
            'باگ ها',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'بهمن 17',
            'الیزابت الیوت',
            'assets/img/portrait/small/avatar-s-3.png',
            'جدید')
    ],
    inProcess: [
        new Task(
            'بازبینی پروژه',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'اردیبهشت 11',
            'بروس راید',
            'assets/img/portrait/small/avatar-s-1.png',
            'درحال پردازش'),
        new Task(
            'نویگیشن سایت',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'اردیبهشت 11',
            'بروس راید',
            'assets/img/portrait/small/avatar-s-1.png',
            'درحال پردازش'),
        new Task(
            'بوتسترپ 4',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'اردیبهشت 11',
            'بروس راید',
            'assets/img/portrait/small/avatar-s-1.png',
            'درحال پردازش')
    ],
    backLog: [
        new Task(
            'ارزیابی',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل'),
        new Task(
            'زمان بندی',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل'),
        new Task(
            'یونیت تست',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل')
    ],
    completed: [
        new Task(
            'آنگولار 8',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل'),
        new Task(
            'فیلد ها',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل'),
        new Task(
            'بازبینی وظیفه',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل')
    ]

};

export function taskReducer(state = initialState, action: TaskActions.TaskActions) {
    switch (action.type) {
        case (TaskActions.ADD_TODO):
            const todo = [...state.todo];
            return {
                ...state,
                todo: [...state.todo, action.payload]
            };
        default:
            return state;
    }
}
