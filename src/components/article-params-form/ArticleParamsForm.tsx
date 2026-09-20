import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { ArrowButton } from '../../ui/arrow-button';
import { Button } from '../../ui/button';
import { RadioGroup } from '../../ui/radio-group';
import { Select } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Text } from '../../ui/text';

import type { ArticleStateType, OptionType } from '@/constants/articleProps';
import type { FormEvent } from 'react';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [draftSettings, setDraftSettings] = useState(defaultArticleState);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);

    return (): void => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(draftSettings);
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDraftSettings(defaultArticleState);
    onApply(defaultArticleState);
  };

  const createChangeHandler =
    (field: keyof ArticleStateType) =>
    (value: OptionType): void => {
      setDraftSettings((currentState) => ({ ...currentState, [field]: value }));
    };

  return (
    <div ref={containerRef}>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen((current) => !current)} />
      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            selected={draftSettings.fontFamilyOption}
            options={fontFamilyOptions}
            title="шрифт"
            onChange={createChangeHandler('fontFamilyOption')}
          />
          <RadioGroup
            name="fontSize"
            selected={draftSettings.fontSizeOption}
            options={fontSizeOptions}
            title="размер шрифта"
            onChange={createChangeHandler('fontSizeOption')}
          />
          <Select
            selected={draftSettings.fontColor}
            options={fontColors}
            title="цвет шрифта"
            onChange={createChangeHandler('fontColor')}
          />
          <Separator />
          <Select
            selected={draftSettings.backgroundColor}
            options={backgroundColors}
            title="цвет фона"
            onChange={createChangeHandler('backgroundColor')}
          />
          <Select
            selected={draftSettings.contentWidth}
            options={contentWidthArr}
            title="ширина контента"
            onChange={createChangeHandler('contentWidth')}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
