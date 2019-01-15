﻿// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschränkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Squidex.Domain.Apps.Core.Schemas;
using Squidex.Infrastructure;
using Xunit;

namespace Squidex.Domain.Apps.Entities.Schemas.Guards.FieldProperties
{
    public class ReferencesFieldPropertiesTests
    {
        [Fact]
        public void Should_add_error_if_min_items_greater_than_max_items()
        {
            var sut = new ReferencesFieldProperties { MinItems = 10, MaxItems = 5 };

            var errors = FieldPropertiesValidator.Validate(sut).ToList();

            errors.Should().BeEquivalentTo(
                new List<ValidationError>
                {
                    new ValidationError("Max items must be greater or equal to min items.", "MinItems", "MaxItems")
                });
        }

        [Fact]
        public void Should_not_add_error_if_min_items_greater_equals_to_max_items()
        {
            var sut = new ReferencesFieldProperties { MinItems = 2, MaxItems = 2 };

            var errors = FieldPropertiesValidator.Validate(sut).ToList();

            Assert.Empty(errors);
        }
    }
}
