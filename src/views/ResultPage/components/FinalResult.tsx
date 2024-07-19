import { useContext, useEffect } from 'react';

import Title from '@components/Title';
import useGetRecruitingInfo from '@hooks/useGetRecruitingInfo';
import { RecruitingInfoContext } from '@store/recruitingInfoContext';
import BigLoading from 'views/loadings/BigLoding';

import { bottomAnimation, bottomImg, container, content, contentWrapper, strongText } from './style.css';
// import imgSoptLogo from '../assets/imgSoptLogo.png';
// import imgSoptLogoWebp from '../assets/imgSoptLogo.webp';
import imgMakersLogo from '../assets/imgMakersLogo.png';
import imgMakersLogoWebp from '../assets/imgMakersLogo.webp';
import useGetFinalResult from '../hooks/useGetFinalResult';

const Content = ({ pass }: { pass?: boolean }) => {
  const { data, isLoading } = useGetRecruitingInfo();
  const { name: soptName, season } = data?.data.season || {};
  const {
    recruitingInfo: { name },
  } = useContext(RecruitingInfoContext);

  if (isLoading) return <BigLoading />;

  return (
    <>
      {pass ? (
        <p className={content}>
          <span>{`안녕하세요. ${season}기 ${soptName} 입니다.\n\n`}</span>
          <strong className={strongText}>{`축하드립니다!`}</strong>
          <span>
            {`
              ${name}님은 ${season}기 ${soptName} 신입회원 모집에 최종 합격하셨습니다.
  
              ${name}님과 함께하게 되어 진심으로 기쁩니다.
              향후 활동은 ${name} 공식 노션과 카카오톡 단체 대화방, SOPT 공식 디스코드를 통해
              운영 및 진행됩니다.
          
              오늘 중으로 카카오톡 단체 대화방에 초대해드릴 예정이니 참고 부탁드립니다.\n
            `}
          </span>
          <strong className={strongText}>{`SOPT의 ${season}번째 열정이 되신 것을 축하드립니다!`}</strong>
        </p>
      ) : (
        <p className={content}>
          {`안녕하세요. ${soptName}입니다.
              
            ${name}님은 ${season}기 ${soptName} 신입회원 모집에 불합격하셨습니다.

            지원자님의 뛰어난 역량과 잠재력에도 불구하고 안타깝게도 귀하의 최종 합격 소식을
            전해드리지 못하게 되었습니다.

            한 분 한 분에게 개별적인 피드백을 드리기는 어렵겠으나 저희 SOPT에 지원하셨던
            경험이 한 사람의 IT 창업인으로서 멋진 역할을 해나가시는 데 큰 도움이 되기를 바랍니다.
          `}
        </p>
      )}
    </>
  );
};

const FinalResult = () => {
  const { handleSaveRecruitingInfo } = useContext(RecruitingInfoContext);
  const { finalResult, finalResultIsLoading } = useGetFinalResult();

  const { name, season, group } = finalResult?.data || {};

  useEffect(() => {
    handleSaveRecruitingInfo({
      name,
      season,
      group,
    });
  }, [name, season, group, handleSaveRecruitingInfo]);

  if (finalResultIsLoading) return <BigLoading />;

  const { pass } = finalResult?.data || {};

  return (
    <section className={container}>
      <div className={contentWrapper}>
        <Title>결과 확인</Title>
        <Content pass={pass} />
      </div>
      {pass && (
        <>
          <div className={bottomAnimation} />
          <picture className={bottomImg}>
            <source srcSet={imgMakersLogoWebp} type="image/webp" />
            <img src={imgMakersLogo} alt="sopt-logo" />
          </picture>
        </>
      )}
    </section>
  );
};

export default FinalResult;
