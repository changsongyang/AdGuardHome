import React from 'react';

import intl from 'panel/common/intl';
import { Button } from 'panel/common/ui/Button';
import { MODAL_TYPE } from 'panel/helpers/constants';

interface FormFooterProps {
    modalType: string;
    activeTab: string;
    processingAddFilter: boolean;
    processingConfigFilter: boolean;
    onCancel: () => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({
    modalType,
    activeTab,
    processingAddFilter,
    processingConfigFilter,
    onCancel,
}) => {
    const shouldShowSaveButton = 
        modalType !== MODAL_TYPE.SELECT_MODAL_TYPE || activeTab === 'manual';

    return (
        <div className="modal-footer">
            <Button
                type="button"
                variant="ghost"
                size="medium"
                onClick={onCancel}
            >
                {intl.getMessage('cancel_btn')}
            </Button>

            {shouldShowSaveButton && (
                <Button
                    type="submit"
                    data-testid="filters_save"
                    variant="primary"
                    size="medium"
                    disabled={processingAddFilter || processingConfigFilter}
                >
                    {intl.getMessage('save_btn')}
                </Button>
            )}
        </div>
    );
};
