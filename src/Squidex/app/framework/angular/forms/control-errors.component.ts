/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights r vbeserved
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, OnChanges, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { merge, Subscription } from 'rxjs';

import { fadeAnimation, Types } from '@app/framework/internal';

import { formatError } from './error-formatting';

@Component({
    selector: 'sqx-control-errors',
    styleUrls: ['./control-errors.component.scss'],
    templateUrl: './control-errors.component.html',
    animations: [
        fadeAnimation
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorsComponent implements OnChanges, OnDestroy {
    private displayFieldName: string;
    private control: AbstractControl;
    private controlSubscription: Subscription | null = null;
    private originalMarkAsTouched: any;

    @Input()
    public for: string | AbstractControl;

    @Input()
    public fieldName: string;

    @Input()
    public errors: string;

    @Input()
    public submitted: boolean;

    @Input()
    public submitOnly = false;

    public errorMessages: string[] = [];

    constructor(
        @Optional() @Host() private readonly formGroupDirective: FormGroupDirective,
        private readonly changeDetector: ChangeDetectorRef
    ) {
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }

    public ngOnChanges() {
        if (this.fieldName) {
            this.displayFieldName = this.fieldName;
        } else if (this.for) {
            if (Types.isString(this.for)) {
                this.displayFieldName = this.for.substr(0, 1).toUpperCase() + this.for.substr(1);
            } else {
                this.displayFieldName = 'field';
            }
        }

        let control: AbstractControl | null = null;

        if (Types.isString(this.for)) {
            control = this.formGroupDirective.form.controls[this.for];
        } else {
            control = this.for;
        }

        if (this.control !== control) {
            this.unsubscribe();

            this.control = control;

            if (control) {
                this.controlSubscription =
                    merge(control.valueChanges, control.statusChanges)
                        .subscribe(() => {
                            this.createMessages();
                        });

                this.originalMarkAsTouched = this.control.markAsTouched;

                const self = this;

                this.control['markAsTouched'] = function () {
                    self.originalMarkAsTouched.apply(this, arguments);

                    self.createMessages();
                };
            }
        }

        this.createMessages();
    }

    private unsubscribe() {
        if (this.controlSubscription) {
            this.controlSubscription.unsubscribe();
        }

        if (this.control && this.originalMarkAsTouched) {
            this.control['markAsTouched'] = this.originalMarkAsTouched;
        }
    }

    private createMessages() {
        const errors: string[] = [];

        if (this.control && this.control.invalid && ((this.control.touched && !this.submitOnly) || this.submitted) && this.control.errors) {
            for (let key in <any>this.control.errors) {
                if (this.control.errors.hasOwnProperty(key)) {
                    const message = formatError(this.displayFieldName, key, this.control.errors[key], this.control.value, this.errors);

                    if (message) {
                        errors.push(message);
                    }
                }
            }
        }

        this.errorMessages = errors;

        this.changeDetector.markForCheck();
    }
}