import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button';
import { UserInfoContext } from '@store/userInfoContext';
import { DraftDialog, SubmitDialog } from 'views/dialogs';
import BigLoading from 'views/loadings/BigLoding';

import { getDraft, getQuestions, sendData } from './apis';
import ApplyCategory from './components/ApplyCategory';
import ApplyHeader from './components/ApplyHeader';
import ApplyInfo from './components/ApplyInfo';
import BottomSection from './components/BottomSection';
import CommonSection from './components/CommonSection';
import DefaultSection from './components/DefaultSection';
import PartSection from './components/PartSection';
import useScrollToHash from './hooks/useScrollToHash';
import { buttonWrapper, formContainer, sectionContainer } from './style.css';
import { ApplyError, ApplyRequest, ApplyResponse, QuestionsRequest, QuestionsResponse } from './types';

const ApplyPage = () => {
  const draftDialog = useRef<HTMLDialogElement>(null);
  const submitDialog = useRef<HTMLDialogElement>(null);
  const sectionsRef = useRef<HTMLSelectElement[]>([]);

  const [isInView, setIsInView] = useState([true, false, false]);
  const [sectionsUpdated, setSectionsUpdated] = useState(false);

  const navigate = useNavigate();

  const minIndex = isInView.findIndex((value) => value === true);

  useScrollToHash(); // scrollTo 카테고리

  const { data: draftData, isLoading: draftIsLoading } = useQuery<
    AxiosResponse<ApplyResponse, null>,
    AxiosError<ApplyError, null>,
    AxiosResponse<ApplyResponse, null>,
    string[]
  >({
    queryKey: ['get-draft'],
    queryFn: getDraft,
  });

  const { data: questionsData, isLoading: questionsIsLoading } = useQuery<
    AxiosResponse<QuestionsResponse, QuestionsRequest>,
    AxiosError<ApplyError, QuestionsRequest>,
    AxiosResponse<QuestionsResponse, QuestionsRequest>,
    string[]
  >({
    queryKey: ['get-questions'],
    queryFn: () => getQuestions({ season: draftData?.data.applicant.season, group: draftData?.data.applicant.group }),
    enabled: !!draftData?.data.applicant.season && !!draftData.data.applicant.group,
  });

  const { mutate: draftMutate, isPending: draftIsPending } = useMutation<
    AxiosResponse<ApplyResponse, ApplyRequest>,
    AxiosError<ApplyError, ApplyRequest>,
    ApplyRequest
  >({
    mutationFn: (formData) => sendData('/recruiting-answer/store', formData),
    onSuccess: () => {
      draftDialog.current?.showModal();
    },
  });

  const { mutate: dataMutate, isPending: dataIsPending } = useMutation<
    AxiosResponse<ApplyResponse, ApplyRequest>,
    AxiosError<ApplyError, ApplyRequest>,
    ApplyRequest
  >({
    mutationFn: (formData) => sendData('/recruiting-answer', formData),
    onSuccess: () => {},
  });

  const { handleSubmit, ...formObject } = useForm({ mode: 'onBlur' });
  const { handleSaveUserInfo } = useContext(UserInfoContext);

  useEffect(() => {
    handleSaveUserInfo({
      name: draftData?.data.applicant.name,
      phone: draftData?.data.applicant.phone,
      email: draftData?.data.applicant.email,
      season: draftData?.data.applicant.season,
      group: draftData?.data.applicant.group,
    });

    if (draftData?.data.applicant.part) {
      formObject.setValue('지원파트', draftData?.data.applicant.part);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftData, handleSaveUserInfo]);

  const refCallback = useCallback(
    (element: HTMLSelectElement) => {
      if (element) {
        sectionsRef.current.push(element);

        if (sectionsRef.current.length === 3) {
          setSectionsUpdated(true);
        }
      }
    },
    [sectionsRef],
  );

  useEffect(() => {
    if (!sectionsUpdated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('id');
          const sectionIndex = ['default', 'common', 'partial'].indexOf(sectionId!);

          setIsInView((prev) => {
            const updatedState = [...prev];
            updatedState[sectionIndex] = entry.isIntersecting;
            return updatedState;
          });
        });
      },
      { root: null, rootMargin: '-220px' },
    );

    sectionsRef.current.forEach((section) => {
      observer.observe(section);
    });
  }, [sectionsUpdated]);

  useEffect(() => {
    if (formObject.formState.errors['사진']) {
      navigate('#default');

      return;
    }

    if (Object.keys(formObject.formState.errors).some((key) => key.startsWith('파트'))) {
      formObject.clearErrors('참석여부');
      formObject.clearErrors('개인정보수집동의');
      formObject.clearErrors('동아리를 알게 된 경로');

      return;
    }

    if (formObject.formState.errors['참석여부'] || formObject.formState.errors['개인정보수집동의']) {
      if (Object.keys(formObject.formState.errors).length > 2) return;
      navigate('#check-necessary');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formObject.formState.errors['사진'],
    formObject.formState.errors['참석여부'],
    formObject.formState.errors['개인정보수집동의'],
  ]);

  if (draftIsLoading || questionsIsLoading) return <BigLoading />;

  const applicantDraft = draftData?.data?.applicant;
  const commonQuestionsDraft = draftData?.data?.commonQuestions;
  const partQuestionsDraft = draftData?.data?.partQuestions;

  let selectedPart: string = formObject.getValues('지원파트');
  if (selectedPart === '기획') selectedPart = 'PM';
  const selectedPartId = questionsData?.data.questionTypes.find((type) => type.typeKr === selectedPart)?.id;
  const partQuestions = questionsData?.data.partQuestions.find(
    (part) => part.recruitingQuestionTypeId === selectedPartId,
  );
  const partQuestionIds = partQuestions?.questions.map((question) => question.id);
  const commonQuestionIds = questionsData?.data.commonQuestions.questions.map((question) => question.id);

  const handleSendData = (type: 'draft' | 'submit') => {
    const mostRecentSeasonValue = formObject.getValues('이전 기수 활동 여부 (제명 포함)');
    const mostRecentSeason = mostRecentSeasonValue === '해당사항 없음' ? 0 : mostRecentSeasonValue;

    const leaveAbsenceValue = formObject.getValues('재학여부');
    const leaveAbsence = leaveAbsenceValue === '재학' ? true : false;

    const univYearValue = formObject.getValues('학년');
    const univYear =
      univYearValue === '1학년'
        ? 1
        : univYearValue === '2학년'
          ? 2
          : univYearValue === '3학년'
            ? 3
            : univYearValue === '4학년'
              ? 4
              : 5;

    const commonAnswers =
      commonQuestionIds?.map((id) => ({
        recruitingQuestionId: id,
        answer: formObject.getValues()[`공통${id}번`],
      })) ?? [];
    const partAnswers =
      partQuestionIds?.map((id) => ({
        recruitingQuestionId: id,
        answer: formObject.getValues()[`파트${id}번`],
      })) ?? [];

    const answers = JSON.stringify([...commonAnswers, ...partAnswers]);

    const formValues: ApplyRequest = {
      picture: formObject.getValues('사진')[0],
      part: formObject.getValues('지원파트'),
      address: formObject.getValues('거주지'),
      birthday: formObject.getValues('생년월일'),
      college: formObject.getValues('학교'),
      gender: formObject.getValues('성별'),
      knownPath: formObject.getValues('동아리를 알게 된 경로'),
      leaveAbsence,
      major: formObject.getValues('학과'),
      mostRecentSeason,
      univYear,
      nearestStation: formObject.getValues('지하철역'),
      answers,
      willAppjam: false,
    };

    type === 'draft' ? draftMutate(formValues) : dataMutate(formValues);
  };

  const handleApplySubmit = () => {
    submitDialog.current?.showModal();
  };

  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = true; // Included for legacy support, e.g. Chrome/Edge < 119
  });

  return (
    <>
      <DraftDialog ref={draftDialog} />
      <SubmitDialog
        userInfo={{
          name: formObject.getValues('이름'),
          email: formObject.getValues('이메일'),
          phone: formObject.getValues('연락처'),
          part: formObject.getValues('지원파트'),
        }}
        dataIsPending={dataIsPending}
        ref={submitDialog}
        onSendData={() => handleSendData('submit')}
      />
      <form onSubmit={handleSubmit(handleApplySubmit)} className={formContainer}>
        <ApplyHeader isLoading={draftIsPending || dataIsPending} onSaveDraft={() => handleSendData('draft')} />
        <ApplyInfo />
        <ApplyCategory minIndex={minIndex} />
        <div className={sectionContainer}>
          <DefaultSection refCallback={refCallback} applicantDraft={applicantDraft} formObject={formObject} />

          <CommonSection
            refCallback={refCallback}
            questions={questionsData?.data.commonQuestions.questions}
            commonQuestionsDraft={commonQuestionsDraft}
            formObject={formObject}
          />
          <PartSection
            refCallback={refCallback}
            part={applicantDraft?.part}
            questions={questionsData?.data.partQuestions}
            partQuestionsDraft={partQuestionsDraft}
            formObject={formObject}
          />
        </div>
        <BottomSection knownPath={applicantDraft?.knownPath} formObject={formObject} />
        <div className={buttonWrapper}>
          <Button
            isLoading={draftIsPending || dataIsPending}
            onClick={() => handleSendData('draft')}
            buttonStyle="line">
            임시저장
          </Button>
          <Button isLoading={draftIsPending || dataIsPending} type="submit">
            제출하기
          </Button>
        </div>
      </form>
    </>
  );
};

export default ApplyPage;
