import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform directive nodes (:::note, :::info, etc.) into admonition HTML
 * Compatible with Docusaurus-style admonitions
 */
export function remarkAdmonitions() {
  const admonitionTypes = {
    note: {
      keyword: '筆記',
      icon: 'bi-pencil-square',
      className: 'note',
    },
    tip: {
      keyword: '提示',
      icon: 'bi-lightbulb',
      className: 'tip',
    },
    info: {
      keyword: '資訊',
      icon: 'bi-info-circle',
      className: 'info',
    },
    warning: {
      keyword: '警告',
      icon: 'bi-exclamation-triangle',
      className: 'warning',
    },
    danger: {
      keyword: '危險',
      icon: 'bi-x-octagon',
      className: 'danger',
    },
  };

  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.type !== 'containerDirective') return;

        const type = node.name;
        const config = admonitionTypes[type];

        if (!config) return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const title = attributes.title || config.keyword;

        // Transform the directive into a div with admonition classes
        data.hName = 'div';
        data.hProperties = {
          class: `admonition admonition-${config.className}`,
        };

        // Create the title element
        const titleNode = {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: {
              class: 'admonition-heading',
            },
          },
          children: [
            {
              type: 'html',
              value: `<i class="bi ${config.icon}"></i>`,
            },
            {
              type: 'text',
              value: title,
            },
          ],
        };

        // Create the content wrapper
        const contentNode = {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: {
              class: 'admonition-content',
            },
          },
          children: node.children,
        };

        // Replace children with structured content
        node.children = [titleNode, contentNode];
      }
    });
  };
}
