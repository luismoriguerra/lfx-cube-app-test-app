// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, AbstractControl, Validators } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'lfx-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @ViewChild('input') public input: ElementRef<HTMLInputElement>;

  @Input() public parent!: UntypedFormGroup;
  @Input() public control!: string;
  @Input() public placeholder: string = '';
  @Input() public label: string = '';
  @Input() public type: string = 'input';
  @Input() public showClear: boolean = false;
  @Input() public pattern: string = '';
  @Input() public icon: IconProp | null = null;

  @Output() public readonly keypressed: EventEmitter<any> = new EventEmitter<any>();

  public inputControl: AbstractControl;

  public constructor() {}

  public ngOnInit(): void {
    if (!this.control) {
      throw new Error(`Attribute 'control' is required`);
    }

    this.inputControl = this.parent.get(this.control) as AbstractControl;
  }

  public get hasValue(): boolean {
    return this.inputControl.value;
  }

  public get hasError(): boolean {
    return this.inputControl.invalid && this.inputControl.dirty;
  }

  public get requiredField(): boolean {
    return this.inputControl.hasValidator(Validators.required);
  }

  public get getErrorMessage(): string {
    return this.hasError && this.inputControl.hasError('required')
      ? 'This field is required.'
      : this.inputControl.hasError(this.control)
      ? this.inputControl.getError(this.control)
      : this.inputControl.hasError('minlength')
      ? `At least ${this.inputControl.getError('minlength').requiredLength} characters required`
      : this.inputControl.hasError('maxlength')
      ? 'Max character length exceeded'
      : this.inputControl.hasError('file')
      ? 'Please upload a valid file'
      : this.inputControl.hasError('url')
      ? 'Please enter a valid URL including http/https protocol'
      : this.inputControl.hasError('email')
      ? 'Please enter a valid email'
      : this.inputControl.hasError('exists')
      ? 'Value already exists'
      : this.inputControl.hasError('numeric')
      ? 'Value needs to be numeric'
      : this.inputControl.hasError('fullName')
      ? 'Please enter a valid first and last name'
      : this.inputControl.hasError('custom')
      ? this.inputControl.getError('custom')
      : 'Please enter a valid input';
  }

  public clearValue(): void {
    this.inputControl.setValue('');
  }
}
