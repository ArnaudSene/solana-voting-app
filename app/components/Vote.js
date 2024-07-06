import React, { useEffect, useState } from 'react';
import { useAppContext } from "../context/context";
import style from '../styles/Vote.module.css';
import { BN } from 'bn.js';

const ONE_SECOND = new BN('1000');
const ONE_MINUTE = ONE_SECOND.mul(new BN('60'));
const ONE_HOUR = ONE_MINUTE.mul(new BN('60'));
const ONE_DAY = ONE_HOUR.mul(new BN('24'));

const Vote = ({ account, publicKey }) => {
	const { vote } = useAppContext();
	const [timeLeft, setTimeLeft] = useState('');
	const [voteOver, setVoteOver] = useState(false);

	useEffect(() => {
    	console.log(account);
		const deadline = account.deadline;
       	console.log('deadline', deadline);

		const updateTimer = (_deadline) => {
			const now = new BN(Date.now().toString());
			let distance = _deadline.sub(now);
			
			if (distance.isNeg()) {
				console.log(`over distance : ${distance}`);
				setTimeLeft('Voting has ended.');
				setVoteOver(true);
			} else {
				const days = distance.div(ONE_DAY);
				distance = distance.mod(ONE_DAY);

				const hours = distance.div(ONE_HOUR);
				distance = distance.mod(ONE_HOUR);

				const minutes = distance.div(ONE_MINUTE);
				distance = distance.mod(ONE_MINUTE);

				const seconds = distance.div(ONE_SECOND);
				setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
			}
		};	
   
       	// updateTimer(deadline);
		const interval = setInterval(() => updateTimer(deadline), 1000);
   
		return () => clearInterval(interval);
	}, []);

  return (
    <div className={style.wrapper}>
       {/* <h2 className={style.title}>{account.topic}</h2> */}
       <h2 className={style.title}>{account.title}</h2>
       <h3>{account.description}</h3>
       {account.choices.map((choice, index) => (
         <div key={index} className={style.choice}>
           <div>
             <p>choice {index + 1}: {choice.label}</p>
             <p className={style.voteCount}>Votes: {parseInt(choice.count)}</p>
           </div>
           {!voteOver && (
            <button
              className={style.button}
              onClick={() => vote(index, publicKey)}
            >
              Vote
            </button>
          )}
         </div>
       ))}
       <div className={style.timer}>
		
         {timeLeft}
       </div>
     </div>
  );
};

export default Vote;
