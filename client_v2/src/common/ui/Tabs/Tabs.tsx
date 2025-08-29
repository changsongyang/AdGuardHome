import React, { useState } from 'react';

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

export interface TabsProps {
    tabs: TabItem[];
    defaultActiveTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    className,
}) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
        defaultActiveTab || tabs[0]?.id || ''
    );

    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

    const handleTabClick = (tabId: string) => {
        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId);
        }
        onTabChange?.(tabId);
    };

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={`tabs ${className || ''}`}>
            <div className="tabs__nav">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`tabs__nav-item ${
                            activeTab === tab.id ? 'tabs__nav-item--active' : ''
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs__content">
                {activeTabContent}
            </div>
        </div>
    );
};
