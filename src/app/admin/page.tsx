"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Input,
} from "@heroui/react";
import { Toaster, toast } from 'react-hot-toast';
import QuestionFormModal from "@/components/QuestionFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import type { InterviewQuestion, InterviewCategory } from "@/types/interview";
import { getAPIPath } from "@/config/api.config";

export default function AdminPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, questionsRes] = await Promise.all([
        fetch(getAPIPath('/api/interviews/categories')),
        fetch(getAPIPath('/api/interviews')),
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json() as InterviewCategory[];
        setCategories(categoriesData);
      }

      if (questionsRes.ok) {
        const questionsData = await questionsRes.json() as InterviewQuestion[];
        setQuestions(questionsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter((q) =>
    searchQuery === "" ||
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handlers
  const handleCreate = () => {
    setSelectedQuestion(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(getAPIPath(`/api/interviews/${selectedQuestion.id}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      toast.success('删除成功');
      setIsDeleteModalOpen(false);
      setSelectedQuestion(null);
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : '删除失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = async () => {
    toast.success(selectedQuestion ? '更新成功' : '创建成功');
    await fetchData();
  };

  // Difficulty mapping
  const difficultyColor = {
    easy: "success" as const,
    medium: "warning" as const,
    hard: "danger" as const,
  };

  const difficultyText = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">面试题管理</h1>
              <p className="text-gray-500 mt-1">
                管理和编辑所有面试题目
              </p>
            </div>
            <Button
              color="primary"
              size="lg"
              onClick={handleCreate}
              className="font-semibold"
            >
              ✚ 添加面试题
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Stats */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Input
            placeholder="搜索题目或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            variant="bordered"
            startContent={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-primary">{filteredQuestions.length}</span> 道题目
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardBody className="text-center py-20">
              <p className="text-gray-500">
                {searchQuery ? '没有找到匹配的题目' : '还没有面试题，点击上方按钮添加'}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Question Info */}
                    <div className="flex-1 min-w-0">
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Chip
                          size="sm"
                          color={difficultyColor[question.difficulty]}
                          variant="flat"
                        >
                          {difficultyText[question.difficulty]}
                        </Chip>
                        <Chip size="sm" variant="flat" color="default">
                          {categories.find((c) => c.id === question.category)?.name}
                        </Chip>
                        <span className="text-xs text-gray-400">
                          ID: {question.id}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {question.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <Chip
                            key={tag}
                            size="sm"
                            variant="dot"
                            color="primary"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleEdit(question)}
                      >
                        ✏️ 编辑
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => handleDeleteClick(question)}
                      >
                        🗑️ 删除
                      </Button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          题目描述预览:
                        </p>
                        <div
                          className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: question.content,
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          参考答案预览:
                        </p>
                        <div
                          className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: question.answer,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <QuestionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        question={selectedQuestion}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        question={selectedQuestion}
        loading={deleteLoading}
      />
    </div>
  );
}
