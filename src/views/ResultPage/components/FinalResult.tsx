import { useContext, useEffect } from 'react';

import Title from '@components/Title';
import { DeviceTypeContext } from '@store/deviceTypeContext';
import { RecruitingInfoContext } from '@store/recruitingInfoContext';
import BigLoading from 'views/loadings/BigLoding';

import {
  bottomAnimation,
  bottomImgContainer,
  bottomImgVar,
  container,
  content,
  contentWrapperVar,
  scrollBottomGradVar,
  strongText,
} from './style.css';
import imgResultDesktop from '../assets/imgResultDesktop.png';
import imgResultDesktopWebp from '../assets/imgResultDesktop.webp';
import imgResultMobile from '../assets/imgResultMobile.png';
import imgResultMobileWebp from '../assets/imgResultMobile.webp';
import useGetFinalResult from '../hooks/useGetFinalResult';

const Content = ({ pass }: { pass?: boolean }) => {
  const { deviceType } = useContext(DeviceTypeContext);
  const {
    recruitingInfo: { name, soptName, season, group, isMakers },
  } = useContext(RecruitingInfoContext);

  if (!name) return;

  const SOPT_NAME = isMakers ? `SOPT ${soptName}` : soptName;
  return (
    <>
      {pass ? (
        <p className={content}>
          <span>{`안녕하세요. ${season}기 ${SOPT_NAME} 입니다.\n\n`}</span>
          <strong className={strongText[isMakers ? 'makers' : 'sopt']}>{`축하드립니다!`}</strong>
          <span className="amp-mask">
            {`
              ${name}님은 ${season}기 ${SOPT_NAME} ${group}회원 모집에 최종 합격하셨습니다.

              ${name}님과 ${season}기 ${SOPT_NAME}를 함께하게 되어 진심으로 기쁩니다. 

              향후 활동은 ${SOPT_NAME} 공식 노션과 카카오톡 단체 대화방, 디스코드를 통해 운영 및 진행됩니다. ${deviceType === 'DESK' ? '\n' : ''}오늘 중으로 카카오톡 단체 대화방에 초대해드릴 예정입니다.

              SOPT의 ${season}번째 열정이 되신 것을 축하드립니다!
            `}
          </span>
        </p>
      ) : (
        <p className={`amp-mask ${content}`}>
          {`안녕하세요, ${season}기 ${SOPT_NAME}입니다.
          
          먼저 ${season}기 ${SOPT_NAME} ${group}회원 모집에 관심을 가지고 
          합류 여정을 함께해주셔서 감사하다는 말씀을 드립니다. 

          ${name}님은 ${season}기 ${SOPT_NAME} ${group}회원 모집에 불합격하셨습니다.

          지원자님의 뛰어난 역량과 잠재력에도 불구하고 
          안타깝게도 귀하의 최종 합격 소식을 전해드리지 못하게 되었습니다.

          한 분 한 분에게 개별적인 피드백을 드리기는 어렵겠으나 저희 SOPT에 지원하셨던 경험이 ${deviceType === 'DESK' ? '\n' : ''}IT 창업인으로서 멋진 역할을 해나가시는 데 큰 도움이 되기를 바랍니다.  

          감사합니다.
          `}
        </p>
      )}
    </>
  );
};

const FinalResult = () => {
  const { deviceType } = useContext(DeviceTypeContext);
  const { finalResult, finalResultIsLoading } = useGetFinalResult();
  const {
    recruitingInfo: { isMakers },
    handleSaveRecruitingInfo,
  } = useContext(RecruitingInfoContext);

  const { name, pass } = finalResult?.data || {};

  useEffect(() => {
    handleSaveRecruitingInfo({
      name,
    });
  }, [name, handleSaveRecruitingInfo]);

  if (finalResultIsLoading) return <BigLoading />;

  return (
    <section className={container}>
      <div style={{ overflow: 'auto', height: '100%' }}>
        <div className={contentWrapperVar[deviceType]}>
          <Title>결과 확인</Title>
          <Content pass={pass} />
          {pass && (
            <>
              <div className={bottomAnimation[isMakers ? 'makers' : 'sopt']} />
              <div className={bottomImgContainer}>
                {deviceType === 'DESK' ? (
                  <picture className={bottomImgVar['DESK']}>
                    <source srcSet={imgResultDesktopWebp} type="image/webp" />
                    <img src={imgResultDesktop} alt="sopt-logo" />
                  </picture>
                ) : (
                  <picture className={bottomImgVar[deviceType]}>
                    <source srcSet={imgResultMobileWebp} type="image/webp" />
                    <img src={imgResultMobile} alt="sopt-logo" />
                  </picture>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className={scrollBottomGradVar[deviceType]} />
    </section>
  );
};

export default FinalResult;
