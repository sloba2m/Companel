import type { DOMNode } from 'html-react-parser';

import { domToReact } from 'html-react-parser';

import { Box } from '@mui/material';

export const transform = (node: DOMNode) => {
  if (node.type === 'tag' && node.name === 'br') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  if (node.type === 'tag' && node.name === 'div') {
    return (
      <Box sx={{ display: 'flex' }}>
        {domToReact(node.children as DOMNode[], { replace: transform })}
      </Box>
    );
  }

  if (node.type === 'tag' && node.name === 'p') {
    return (
      <Box component="p" sx={{ my: 0 }}>
        {domToReact(node.children as DOMNode[], { replace: transform })}
      </Box>
    );
  }

  return node;
};
