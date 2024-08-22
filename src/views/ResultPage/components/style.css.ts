import { colors } from '@sopt-makers/colors';
import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { Z_INDEX } from '@constants/zIndex';
import { theme } from 'styles/theme.css';

export const container = style({
  position: 'relative',
  width: '100%',
  minHeight: calc.subtract('100vh', '80px'),
  overflow: 'hidden',
});

const contentWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  color: theme.color.baseText,
});

export const contentWrapperVar = styleVariants({
  DESK: [
    contentWrapper,
    {
      margin: '90px auto 0',
      width: 720,
      gap: 50,
      ...theme.font.BODY_1_18_M,
    },
  ],
  TAB: [
    contentWrapper,
    {
      margin: '90px auto 0',
      paddingBottom: 150,
      width: 367,
      gap: 50,
      ...theme.font.BODY_1_18_M,
      letterSpacing: -0.27,
    },
  ],
  MOB: [
    contentWrapper,
    {
      margin: '23px auto 0',
      paddingBottom: 150,

      width: 312,
      gap: 30,
      ...theme.font.BODY_3_14_M,
      letterSpacing: -0.21,
    },
  ],
});

export const content = style({
  whiteSpace: 'pre-line',
  zIndex: Z_INDEX.resultContent,
});

export const strongText = styleVariants({
  sopt: {
    color: theme.color.primary,
  },
  makers: {
    color: colors.secondary,
  },
});

const bottomAnimationBase = style({
  position: 'absolute',
  bottom: '-200px',
  left: '50%',
  opacity: '30%',
  transform: 'translateX(-50%)',
  height: 100,
  borderRadius: '100%',
  backgroundColor: theme.color.primary,
  zIndex: Z_INDEX.resultAnim,
});

const animatedGradient = (bgColor: string) =>
  keyframes({
    '0%': {
      width: '40%',
      boxShadow: `0px 0px 300px 150px ${bgColor}`,
    },

    '100%': {
      width: '80%',
      boxShadow: `0px 0px 300px 200px ${bgColor}`,
    },
  });

export const bottomAnimation = styleVariants(
  {
    sopt: theme.color.primary,
    makers: '#d8d8d8',
  },
  (color) => [
    bottomAnimationBase,
    {
      animation: `${animatedGradient(color)} ease-in-out 3s alternate infinite`,
    },
  ],
);

export const bottomImgContainer = style({
  display: 'flex',
  justifyContent: 'end',
  width: '100%',
});

export const bottomImgVar = styleVariants({
  DESK: [
    {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 428,
      marginRight: 100,
      marginBottom: 72,
    },
  ],
  TAB: [
    {
      width: 79,
      marginRight: calc.subtract('100px', '25vw'),
      marginBottom: 0,
    },
  ],
  MOB: [
    {
      width: 66,
      marginRight: 0,
      marginBottom: 0,
    },
  ],
});

export const bottomSvg = style({
  position: 'absolute',
  bottom: 0,
  right: 0,
  marginBottom: 'calc(56px + (64 * ((100vw - 768px) / 672)))',
  marginRight: 'calc(40px + (60 * ((100vw - 768px) / 672)))',
  width: 584,
});

export const link = style({
  borderBottom: '1px solid currentColor',
});

const scrollBottomGrad = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);',
  zIndex: Z_INDEX.resultGrad,
});

export const scrollBottomGradVar = styleVariants({
  DESK: [
    scrollBottomGrad,
    {
      height: 220,
    },
  ],
  TAB: [
    scrollBottomGrad,
    {
      height: 170,
    },
  ],
  MOB: [
    scrollBottomGrad,
    {
      height: 110,
    },
  ],
});
