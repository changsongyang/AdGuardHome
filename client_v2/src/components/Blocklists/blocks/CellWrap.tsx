import React from 'react';

type Props = {
    value?: string | number;
    formatValue?: (value: string | number) => string;
    formatTitle?: (value: string | number) => string;
};

export const CellWrap = (
    { value }: Props,
    formatValue?: (value: string | number) => string,
    formatTitle = formatValue,
) => {
    if (!value) {
        return '–';
    }
    const cellValue = typeof formatValue === 'function' ? formatValue(value) : value;
    const cellTitle = typeof formatTitle === 'function' ? formatTitle(value) : value;

    return (
        <div className="logs__row o-hidden">
            <span className="logs__text logs__text--full" title={String(cellTitle)}>
                {cellValue}
            </span>
        </div>
    );
};
