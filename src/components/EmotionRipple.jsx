import React from 'react';
import { useSpring } from '@react-spring/web';
import { EmotionRipple } from '../styles/StyledComponents';

const EmotionRippleEffect = ({ emotion }) => {
  const colorMap = {
    '😊': '#FFD700',
    '😢': '#1E90FF',
    '😠': '#FF4500',
    '😎': '#32CD32',
    '🤔': '#9932CC',
  };

  const props = useSpring({
    from: { scale: 0, opacity: 1 },
    to: { scale: 4, opacity: 0 },
    config: { duration: 1000 },
  });

  return <EmotionRipple style={props} color={colorMap[emotion]} />;
};

export default EmotionRippleEffect;