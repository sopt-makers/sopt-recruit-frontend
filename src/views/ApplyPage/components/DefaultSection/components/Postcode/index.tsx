import { useState } from 'react';
import { Address } from 'react-daum-postcode';
import { UseFormReturn } from 'react-hook-form';

import { InputLine, TextBox } from '@components/Input';

interface PostcodeProps {
  disabled: boolean;
  addressDraft?: string;
  formObject: Pick<
    UseFormReturn,
    'register' | 'formState' | 'clearErrors' | 'trigger' | 'watch' | 'setValue' | 'getValues' | 'setError'
  >;
}

const Postcode = ({ disabled, addressDraft, formObject }: PostcodeProps) => {
  const [address, setAddress] = useState('');

  const { clearErrors } = formObject;

  const handleOpenPostcode = () => {
    window.daum &&
      new window.daum.Postcode({
        oncomplete: function ({ address }: Address) {
          setAddress(address);
          clearErrors && clearErrors('address');
        },
        width: 500,
        height: 500,
      }).open({
        left: window.screen.width / 2 - 500 / 2,
        top: window.screen.height / 2 - 500 / 2,
        popupTitle: 'SOPT - 우편 번호 검색 팝업',
        popupKey: 'sopt-postcode-popup',
      });
  };

  return (
    <TextBox label="거주지" name="address" formObject={formObject} required size="lg">
      <InputLine
        name="address"
        placeholder="예) 서울특별시 관악구 신림동"
        onClick={handleOpenPostcode}
        value={address || addressDraft || ''}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', caretColor: 'transparent' }}
        disabled={disabled}
      />
    </TextBox>
  );
};

export default Postcode;
