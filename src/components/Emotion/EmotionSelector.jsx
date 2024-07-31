import React from 'react';

const emotions = ['😊', '😢', '😠', '😎', '🤔'];

function EmotionSelector({ onSelect, selected }) {
  return (
    <div className="emotion-selector">
      {emotions.map((emotion) => (
        <button
          key={emotion}
          onClick={() => onSelect(emotion)}
          className={selected === emotion ? 'selected' : ''}
        >
          {emotion}
        </button>
      ))}
    </div>
  );
}

export default EmotionSelector;