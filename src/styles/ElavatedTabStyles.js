import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { styled } from '@material-ui/core/styles';

export const StyledTabs = styled(Tabs)(({ theme }) => {
  const tabsBackground = 'linear-gradient(60deg, #ab47bc, #8e24aa)';
  const indicatorBackground = 'rgba(255, 255, 255, .2)';
  const borderRadius = theme.spacing(1);
  return {
    root: {
      width: '100%',
      borderRadius: theme.spacing(1),
      background: tabsBackground,
      padding: 10,
      boxShadow: '0px 3px 15px rgba(34, 35, 58, 0.5)'
    },
    indicator: {
      height: '100%',
      borderRadius,
      backgroundColor: indicatorBackground
    }
  };
});

export const StyledTab = styled(Tab)(({ theme }) => {
  const tabsGutter = theme.spacing(2);
  const labelColor = '#ffffff';
  return {
    root: {
      textTransform: 'initial',
      margin: `0 ${tabsGutter}px`,
      minWidth: 0,
      [theme.breakpoints.up('md')]: {
        minWidth: 0
      }
    },
    wrapper: {
      fontWeight: 'normal',
      letterSpacing: 0.5,
      color: labelColor
    }
  };
});
