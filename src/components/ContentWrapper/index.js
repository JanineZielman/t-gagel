import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ContentWrapper.module.scss';
import {OrderButton} from '../Bits/OrderButton'; // Import the OrderButton component

let cx = classNames.bind(styles);

// Decode HTML entities (like &#8221;) to regular characters (like ")
function decodeHtmlEntities(str) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = str;
  return textArea.value;
}

// Replace curly quotes with regular quotes
function replaceCurlyQuotes(str) {
  return str.replace(/[“”]/g, '"');
}

// Function to parse and convert shortcodes to React components
function parseShortcodes(content) {
  // Decode and replace curly quotes
  let decodedContent = decodeHtmlEntities(content);
  decodedContent = replaceCurlyQuotes(decodedContent);

  // Updated regex to account for possible surrounding HTML tags and correctly matched shortcodes
  const orderButtonRegex = /\[order_button link="(.+?)" text="(.+?)"\]/g;

  const parsedContent = [];
  let lastIndex = 0;
  let match;

  while ((match = orderButtonRegex.exec(decodedContent)) !== null) {
    // Push the content before the match (regular text)
    parsedContent.push(decodedContent.slice(lastIndex, match.index));

    // Push the OrderButton component with link and text as props
    parsedContent.push(
      <OrderButton key={match.index} link={match[1]} text={match[2]} />
    );

    // Update last index to the end of the current match
    lastIndex = match.index + match[0].length;
  }

  // Push the remaining content after the last shortcode match
  parsedContent.push(decodedContent.slice(lastIndex));

  return parsedContent;
}

const ContentWrapper = ({ content, children, className }) => {
  const [parsedContent, setParsedContent] = useState(null);

  useEffect(() => {
    if (content) {
      // Parse the content to replace shortcodes with React components
      setParsedContent(parseShortcodes(content));
    }
  }, [content]);

  if (!parsedContent) {
    return null; // Avoid rendering while parsing content
  }

  return (
    <article className={cx(['component', className])}>
      {/* Render the parsed content */}
      <div>
        {parsedContent.map((part, index) =>
          typeof part === 'string' ? (
            <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
          ) : (
            part
          )
        )}
      </div>
      {children}
    </article>
  );
}

export default ContentWrapper