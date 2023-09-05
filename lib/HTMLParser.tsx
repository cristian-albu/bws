"use client";
import React, { useEffect, useCallback, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const modifiedOkaidia = { ...a11yDark };
modifiedOkaidia[`pre[class*="language-"]`].background = "#0d0d0d";

type ParsedObject = {
    key: string;
    content: string;
    children: null | ParsedObject[];
};

function parseHTMLToObjects(collection: HTMLCollection): ParsedObject[] {
    const output = [];
    for (let i = 0; i < collection.length; i++) {
        const element = collection[i] as HTMLElement;
        output.push({
            key: element.tagName.toLowerCase(),
            content: element.children.length > 0 ? "" : element.innerHTML,
            children: element.children.length > 0 ? parseHTMLToObjects(element.children) : null,
        });
    }
    return output;
}

function buildElement(element: ParsedObject) {
    if (element.children) {
        return parsedObjectRenderer(element.children);
    } else {
        return element.content;
    }
}

function renderParsedElement(element: ParsedObject, index: number): React.JSX.Element {
    const key = `${element.key}-${index}`;
    const elem = buildElement(element);

    if (elem === "&nbsp;") {
        return <></>;
    }

    switch (element.key) {
        case "div":
        case "p":
        case "pre":
        case "h2":
        case "h3":
        case "h4":
        case "span":
            return React.createElement(element.key, { key, className: "" }, elem);
        case "code":
            return (
                <div key={key}>
                    <SyntaxHighlighter style={a11yDark} language="javascript">
                        {String(elem)}
                    </SyntaxHighlighter>
                </div>
            );
        default:
            return <></>;
    }
}

function parsedObjectRenderer(elements: ParsedObject[]) {
    return elements.map((element, index) => renderParsedElement(element, index));
}

const ParseAndRenderHTML = ({ html }: { html: string }) => {
    const [docState, setDocState] = useState<React.JSX.Element[] | null>(null);

    const renderHTMLDocument = useCallback(() => {
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(html, "text/html").body.children;
        const parsedDocObject = parseHTMLToObjects(parsedDoc);
        return parsedObjectRenderer(parsedDocObject);
    }, [html]);

    useEffect(() => {
        const renderArray = renderHTMLDocument();
        setDocState(renderArray);
    }, [renderHTMLDocument]);

    return <>{docState && docState.map((element, index) => React.cloneElement(element, { key: `element-${index}` }))}</>;
};

export default ParseAndRenderHTML;
