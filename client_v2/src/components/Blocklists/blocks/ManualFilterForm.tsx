import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import intl from 'panel/common/intl';
import { Input } from 'panel/common/controls/Input';
import { validatePath, validateRequiredValue } from 'panel/helpers/validators';

interface ManualFilterFormProps {
    whitelist?: boolean;
}

export const ManualFilterForm: React.FC<ManualFilterFormProps> = ({ whitelist }) => {
    const { control } = useFormContext();

    return (
        <>
            <div className="form__group">
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="text"
                            data-testid="filters_name"
                            placeholder={intl.getMessage('enter_name_hint')}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            <div className="form__group">
                <Controller
                    name="url"
                    control={control}
                    rules={{ 
                        validate: { validateRequiredValue, validatePath } 
                    }}
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="text"
                            data-testid="filters_url"
                            placeholder={intl.getMessage('enter_url_or_path_hint')}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            <div className="form__description">
                {whitelist
                    ? intl.getMessage('enter_valid_allowlist')
                    : intl.getMessage('enter_valid_blocklist')}
            </div>
        </>
    );
};
