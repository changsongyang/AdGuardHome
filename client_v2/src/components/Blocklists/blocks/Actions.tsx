import React from 'react';
import intl from 'panel/common/intl';
import { Button } from 'panel/common/ui/Button';

type Props = {
    handleAdd: () => void;
    handleRefresh: () => void;
    processingRefreshFilters: boolean;
    whitelist?: boolean;
};

export const Actions = ({ handleAdd, handleRefresh, processingRefreshFilters, whitelist }: Props) => (
    <div className="card-actions">
        <Button 
            variant="primary" 
            size="medium" 
            onClick={handleAdd}
            className="mr-2 mb-2"
        >
            {whitelist ? intl.getMessage('add_allowlist') : intl.getMessage('add_blocklist')}
        </Button>

        <Button
            variant="secondary"
            size="medium"
            onClick={handleRefresh}
            disabled={processingRefreshFilters}
            className="mb-2"
        >
            {intl.getMessage('check_updates_btn')}
        </Button>
    </div>
);
