/* eslint-disable react/prop-types */
import { useState } from "react";

const CollapsibleItem = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div>
            <div onClick={() => setCollapsed(!collapsed)} className="collapsible-header">
                {collapsed ? 'Show' : 'Hide'}
            </div>
            {!collapsed && <div className="collapsible-content">{children}</div>}
        </div>
    );
};

export default CollapsibleItem;
