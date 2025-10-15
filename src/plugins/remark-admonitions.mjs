import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform directive nodes (:::note, :::info, etc.) into admonition HTML
 * Compatible with Docusaurus-style admonitions
 */
export function remarkAdmonitions() {
  const admonitionTypes = {
    danger: {
      className: 'danger',
      icon: 'bi-x-octagon',
      keyword: '危險',
    },
    info: {
      className: 'info',
      icon: 'bi-info-circle',
      keyword: '資訊',
    },
    note: {
      className: 'note',
      icon: 'bi-pencil-square',
      keyword: '筆記',
    },
    tip: {
      className: 'tip',
      icon: 'bi-lightbulb',
      keyword: '提示',
    },
    warning: {
      className: 'warning',
      icon: 'bi-exclamation-triangle',
      keyword: '警告',
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
          data: {
            hName: 'div',
            hProperties: {
              class: 'admonition-heading',
            },
          },
          type: 'paragraph',
        };

        // Create the content wrapper
        const contentNode = {
          children: node.children,
          data: {
            hName: 'div',
            hProperties: {
              class: 'admonition-content',
            },
          },
          type: 'paragraph',
        };

        // Replace children with structured content
        node.children = [titleNode, contentNode];
      }
    });
  };
}
