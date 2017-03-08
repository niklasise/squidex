﻿// ==========================================================================
//  StringLengthValidator.cs
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex Group
//  All rights reserved.
// ==========================================================================

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Squidex.Infrastructure.Tasks;

// ReSharper disable InvertIf

namespace Squidex.Core.Schemas.Validators
{
    public class StringLengthValidator : IValidator
    {
        private readonly int? minLength;
        private readonly int? maxLength;

        public StringLengthValidator(int? minLength, int? maxLength)
        {
            if (minLength.HasValue && maxLength.HasValue && minLength.Value >= maxLength.Value)
            {
                throw new ArgumentException("Min length must be greater than max length", nameof(minLength));
            }

            this.minLength = minLength;
            this.maxLength = maxLength;
        }

        public Task ValidateAsync(object value, ICollection<string> errors)
        {
            if (value is string stringValue)
            {
                if (minLength.HasValue && stringValue.Length < minLength.Value)
                {
                    errors.Add($"<FIELD> must have more than '{minLength}' characters");
                }

                if (maxLength.HasValue && stringValue.Length > maxLength.Value)
                {
                    errors.Add($"<FIELD> must have less than '{maxLength}' characters");
                }
            }

            return TaskHelper.Done;
        }
    }
}
