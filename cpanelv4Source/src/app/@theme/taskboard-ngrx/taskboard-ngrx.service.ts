import { Injectable } from '@angular/core';
import { Task } from './taskboard-ngrx.model';

@Injectable()
export class TaskBoardService {

    constructor() { }

    public todo: Task[] = [
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
    ];

    public inProcess: Task[] = [
        new Task(
            'بازبینی پروژه',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'اردیبهشت 11',
            'بروس راید',
            'assets/img/portrait/small/avatar-s-1.png',
            'درحال پردازش'),
        new Task(
            'Navigation',
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
    ];

    public backLog: Task[] = [
        new Task(
            'ارزیابی',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل'),
        new Task(
            'Schedule',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل'),
        new Task(
            'Unit tests',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'مرداد 19',
            'کلی رایز',
            'assets/img/portrait/small/avatar-s-5.png',
            'تکمیل')
    ];

    public completed: Task[] = [
        new Task(
            'آنگولار 8',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل'),
        new Task(
            'Fields',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل'),
        new Task(
            'Task board',
            'تغییر عملکرد ها به یک حرکت نرم در ریسپانسیو',
            'دی 22',
            'سارا کریمی',
            'assets/img/portrait/small/avatar-s-7.png',
            'تکمیل')
    ];

    addNewTask(title: string, message: string) {
        this.todo.push(new Task(
            title,
            message,
            'خرداد 12',
            'الیزابت الیوت',
            'assets/img/portrait/small/avatar-s-3.png',
            'جدید'
        ))
    }
    gettodo() {
        return this.todo;
      }
}