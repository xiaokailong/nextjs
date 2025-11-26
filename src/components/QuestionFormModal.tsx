"use client";

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
} from '@heroui/react';
import RichTextEditor from './RichTextEditor';
import type { InterviewQuestion, InterviewCategory } from '@/types/interview';
import { getAPIPath } from '@/config/api.config';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question?: InterviewQuestion | null;
  categories: InterviewCategory[];
}

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSuccess,
  question,
  categories,
}: QuestionFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
    content: '',
    answer: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 编辑模式下初始化表单
  useEffect(() => {
    if (question && isOpen) {
      setFormData({
        title: question.title || '',
        category: question.category || '',
        difficulty: question.difficulty || 'medium',
        tags: Array.isArray(question.tags) ? question.tags : [],
        content: question.content || '',
        answer: question.answer || '',
      });
    } else if (!isOpen) {
      // 关闭时重置表单
      setFormData({
        title: '',
        category: '',
        difficulty: 'medium',
        tags: [],
        content: '',
        answer: '',
      });
      setTagInput('');
      setError('');
    }
  }, [question, isOpen]);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async () => {
    // 验证
    if (!formData.title.trim()) {
      setError('请输入题目标题');
      return;
    }
    if (!formData.category) {
      setError('请选择分类');
      return;
    }
    if (!formData.content.trim()) {
      setError('请输入题目内容');
      return;
    }
    if (!formData.answer.trim()) {
      setError('请输入参考答案');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = question
        ? getAPIPath(`/api/interviews/${question.id}`)
        : getAPIPath('/api/interviews');
      const method = question ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || '操作失败');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[95vh]',
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">
            {question ? '编辑面试题' : '添加面试题'}
          </h2>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* 标题 */}
            <Input
              label="题目标题"
              placeholder="请输入题目标题"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              isRequired
              variant="bordered"
            />

            {/* 分类和难度 */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="分类"
                placeholder="选择分类"
                selectedKeys={formData.category ? [formData.category] : []}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                isRequired
                variant="bordered"
              >
                {categories.map((category) => (
                  <SelectItem key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="难度"
                placeholder="选择难度"
                selectedKeys={[formData.difficulty]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                  })
                }
                isRequired
                variant="bordered"
              >
                <SelectItem key="easy">
                  简单
                </SelectItem>
                <SelectItem key="medium">
                  中等
                </SelectItem>
                <SelectItem key="hard">
                  困难
                </SelectItem>
              </Select>
            </div>

            {/* 标签 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="输入标签后按回车添加"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  variant="bordered"
                />
                <Button color="primary" onClick={handleAddTag}>
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    onClose={() => handleRemoveTag(tag)}
                    variant="flat"
                    color="primary"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 题目内容 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                题目描述 <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
                placeholder="请输入题目描述..."
              />
            </div>

            {/* 参考答案 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                参考答案 <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={formData.answer}
                onChange={(answer) => setFormData({ ...formData, answer })}
                placeholder="请输入参考答案..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            取消
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            {question ? '保存' : '创建'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
