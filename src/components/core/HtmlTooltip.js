import * as React from 'react';
import { styled } from '@material-ui/styles';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}));

const CustomHtmlTooltip = (props) => (
  <HtmlTooltip title={props.title || 'tooltip'}>{props.children}</HtmlTooltip>
);
export default CustomHtmlTooltip;
