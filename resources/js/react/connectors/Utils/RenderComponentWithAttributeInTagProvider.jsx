import React from "react";

export const RenderComponentWithAttributeInTagProvider = ({children, dataTag, node, propName}) => {
    const [value, setValue] = React.useState(null);

    React.useEffect(() => {
        if (!node) return;

        const updateValue = () => {
            const newValue = node.getAttribute(dataTag); //'data-articulo-id'
            if (newValue) setValue(newValue);
        };

        updateValue(); // inicial

        const observer = new MutationObserver(updateValue);
        observer.observe(node, {attributes: true, attributeFilter: [dataTag]});

        return () => observer.disconnect();
    }, []);

    const childrenConProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {[propName]: value});
        }
        return child;
    });

    return <>{childrenConProps}</>;
};
