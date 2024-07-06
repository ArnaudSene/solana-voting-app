import React, { useState } from 'react';
import { useAppContext } from "../context/context";
import style from '../styles/SetupVote.module.css';

const SetupVote = () => {
  const { createVote } = useAppContext();
  const [title, setTitle] = useState('');
  const [choices, setChoices] = useState('');
  const [duration, setDuration] = useState('');

  const creerVote = () => {
    const _choices = choices.split(',').map(choice => choice.trim());
    createVote(title, "", _choices, parseInt(duration));
  };

  return (
    <div className={style.container}>
      <label className={style.label} htmlFor="title">Vote Titre</label>
      <input
        className={style.input}
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <label className={style.label} htmlFor="choices">Choix (séparé par des virgules)</label>
      <input
        className={style.input}
        type="text"
        id="choices"
        value={choices}
        onChange={(e) => setChoices(e.target.value)}
      />

      <label className={style.label} htmlFor="duration">Durée en jour</label>
      <input
        className={style.input}
        type="number"
        id="duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <a className={style.button} onClick={creerVote}>
        Creer un vote
      </a>
    </div>
  );
};

export default SetupVote;
