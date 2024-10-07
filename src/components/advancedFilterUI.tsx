import React from 'react';
import { AdvancedFilterUIType } from '../type/type';

const AdvancedFilterUI = ({visible, changeVisible, data}: AdvancedFilterUIType) => (
  visible &&
  <div className='fixed z-50 w-screen h-screen flex-center overflow-scroll'>
    <div className='absolute blur-lg bg-black opacity-30 inset-0' onClick={()=>changeVisible(false)}/>
    <div className='relative bg-white rounded-md shadow-lg w-2/3 h-fit min-h-[20rem] p-8 z-10 '>
      {JSON.stringify(data)}
    </div>
  </div>
);

export default AdvancedFilterUI;
