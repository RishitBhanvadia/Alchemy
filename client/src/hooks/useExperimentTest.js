import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

export default function useExperimentTest(experimentType, correctAnswerMatch, successMessage) {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);
  const [first, setFirst] = useState(true);
  const [datanum, setDatanum] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [uans, setUAns] = useState('');

  const send_info = (i) => {
    setOn(true);
    setTimeout(() => {
      setOn(false);
    }, 1000);
    setFirst(false);
    setDatanum(i);
  };

  const checkAns = async () => {
    if (correctAnswerMatch(uans)) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('experiment_results')
            .insert([
              {
                user_id: user.id,
                experiment_type: experimentType,
                score: 100,
                details: { result: successMessage }
              }
            ]);

          if (error) {
             logger.error(`Error saving ${experimentType} result:`, error);
          } else {
             logger.info(`${experimentType} result saved successfully`);
          }
        }
      } catch (err) {
        logger.error("Supabase error:", err);
      }
      navigate("/success", {
        replace: true,
      });
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
      }, 1000);
    }
  };

  const handleChange = (event) => {
    setUAns(event.target.value);
  };

  return {
    on,
    first,
    datanum,
    wrong,
    uans,
    send_info,
    checkAns,
    handleChange
  };
}
