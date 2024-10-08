import React, {useEffect, useState} from 'react';
import {
  ChoiceList,
  TextField,
  Text,
  InlineError,
  BlockStack,
} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';

import type {Field, PositiveNumericString} from '../../../../types';
import {forcePositiveInteger} from '../../../../utilities/numbers';

import styles from './UsageLimits.scss';

export enum UsageLimitType {
  TotalUsageLimit = 'TOTAL_USAGE_LIMIT',
  OncePerCustomerLimit = 'ONCE_PER_CUSTOMER_LIMIT',
}

export const DISCOUNT_TOTAL_USAGE_LIMIT_FIELD = 'totalUsageLimit';

interface Props {
  /**
   * The total number of times the discount can be used.
   */
  totalUsageLimit: Field<PositiveNumericString | null>;

  /**
   * When selected, the discount may be used at most once per customer
   */
  oncePerCustomer: Field<boolean>;
}

export function UsageLimits({totalUsageLimit, oncePerCustomer}: Props) {
  const [showUsageLimit, setShowUsageLimit] = useState(
    totalUsageLimit.value !== null,
  );

  const [i18n] = useI18n();

  useEffect(
    () => setShowUsageLimit(totalUsageLimit.value !== null),
    [totalUsageLimit.value],
  );

  const handleUsageLimitsChoicesChange = (
    selectedUsageLimitTypes: UsageLimitType[],
  ) => {
    const newOncePerCustomer = selectedUsageLimitTypes.includes(
      UsageLimitType.OncePerCustomerLimit,
    );

    // When the checkbox is toggled, either set the totalUsageLimit value to null (null === checkbox off) or an empty string (non-null === checkbox on)
    if (!selectedUsageLimitTypes.includes(UsageLimitType.TotalUsageLimit)) {
      totalUsageLimit.onChange(null);
    } else if (totalUsageLimit.value === null) {
      totalUsageLimit.onChange('');
    }

    newOncePerCustomer !== oncePerCustomer.value &&
      oncePerCustomer.onChange(newOncePerCustomer);
  };

  return (
    <BlockStack gap="400">
      <Text variant="headingMd" as="h2">
        {i18n.translate('DiscountAppComponents.UsageLimitsCard.title')}
      </Text>
      <ChoiceList
        title={i18n.translate('DiscountAppComponents.UsageLimitsCard.options')}
        titleHidden
        allowMultiple
        selected={[
          ...(showUsageLimit ? [UsageLimitType.TotalUsageLimit] : []),
          ...(oncePerCustomer.value
            ? [UsageLimitType.OncePerCustomerLimit]
            : []),
        ]}
        choices={[
          {
            label: i18n.translate(
              'DiscountAppComponents.UsageLimitsCard.totalUsageLimitLabel',
            ),
            value: UsageLimitType.TotalUsageLimit,
            renderChildren: (isSelected: boolean) => (
              <BlockStack>
                {isSelected && (
                  <div className={styles.TotalUsageLimitTextField}>
                    <TextField
                      id={DISCOUNT_TOTAL_USAGE_LIMIT_FIELD}
                      label={i18n.translate(
                        'DiscountAppComponents.UsageLimitsCard.totalUsageLimitLabel',
                      )}
                      autoComplete="off"
                      labelHidden
                      value={totalUsageLimit.value || ''}
                      onChange={(nextValue) => {
                        totalUsageLimit.onChange(
                          forcePositiveInteger(nextValue),
                        );
                      }}
                      onBlur={totalUsageLimit.onBlur}
                      error={Boolean(totalUsageLimit.error)}
                    />
                  </div>
                )}
                {/* {isRecurring && (
                    <Text as="span" tone="subdued">
                    {i18n.translate(
                        'DiscountAppComponents.UsageLimitsCard.totalUsageLimitHelpTextSubscription',
                    )}
                    </Text>
                )} */}
                {isSelected && totalUsageLimit.error && (
                  <InlineError
                    fieldID={DISCOUNT_TOTAL_USAGE_LIMIT_FIELD}
                    message={totalUsageLimit.error}
                  />
                )}
              </BlockStack>
            ),
          },
          {
            label: i18n.translate(
              'DiscountAppComponents.UsageLimitsCard.oncePerCustomerLimitLabel',
            ),
            value: UsageLimitType.OncePerCustomerLimit,
          },
        ]}
        onChange={handleUsageLimitsChoicesChange}
      />
    </BlockStack>
  );
}
