"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Divider,
  Accordion,
  AccordionItem,
  ScrollShadow,
  Spinner,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import type { InterviewQuestion, InterviewCategory } from "@/types/interview";
import { getAPIPath } from "@/config/api.config";

export default function InterviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const categoriesRes = await fetch(getAPIPath('/api/interviews/categories'));
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json() as InterviewCategory[];
        setCategories(categoriesData);
        setExpandedCategories(new Set(categoriesData.map((c) => c.id)));
        
        const questionsRes = await fetch(getAPIPath('/api/interviews'));
        if (!questionsRes.ok) throw new Error('Failed to fetch questions');
        const questionsData = await questionsRes.json() as InterviewQuestion[];
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter((q) => {
      const matchSearch =
        searchQuery === "" ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
    const categoryOrder = categories.map(c => c.id);
    return filtered.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return parseInt(a.id) - parseInt(b.id);
    });
  }, [searchQuery, questions, categories]);

  const questionsByCategory = useMemo(() => {
    const grouped: { [key: string]: InterviewQuestion[] } = {};
    filteredQuestions.forEach((q) => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push(q);
    });
    return grouped;
  }, [filteredQuestions]);

  const difficultyColor = { easy: "success" as const, medium: "warning" as const, hard: "danger" as const };
  const difficultyText = { easy: "简单", medium: "中等", hard: "困难" };

  const scrollToQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    const element = questionRefs.current[questionId];
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-red-500 mb-2">❌ 加载失败</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Velen's Frontend</h1>
              <p className="text-sm text-gray-500 mt-1">Frontend Interview</p>
            </div>
            <Button size="sm" color="primary" variant="flat" onClick={() => router.push('/admin')} className="flex-shrink-0">
              ⚙️ 管理
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Input
            placeholder="搜索题目或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            variant="bordered"
            classNames={{ input: "text-sm", inputWrapper: "h-10" }}
          />
        </div>

        <ScrollShadow className="flex-1 overflow-y-auto">
          <div className="px-2 pb-4">
            {categories.map((category) => {
              const categoryQuestions = questionsByCategory[category.id] || [];
              const isExpanded = expandedCategories.has(category.id);
              return (
                <div key={category.id} className="mb-0.5">
                  <div
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <Chip size="sm" variant="flat" className="text-xs">{categoryQuestions.length}</Chip>
                  </div>

                  {isExpanded && categoryQuestions.length > 0 && (
                    <div className="ml-6 mt-0.5 space-y-0.5">
                      {categoryQuestions.map((question) => (
                        <div
                          key={question.id}
                          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                            selectedQuestionId === question.id ? "bg-primary-50 text-primary" : "hover:bg-gray-50 text-gray-600"
                          }`}
                          onClick={() => scrollToQuestion(question.id)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs flex-1 line-clamp-2" title={question.title}>{question.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollShadow>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All</h2>
              <p className="text-sm text-gray-500 mt-1">Total {filteredQuestions.length}</p>
            </div>
          </div>
        </div>

        <ScrollShadow className="flex-1 overflow-y-auto px-1 py-1">
          <div className="max-w-6xl mx-auto space-y-5">
            {filteredQuestions.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-500">暂无匹配的题目</p>
                </CardBody>
              </Card>
            ) : (
              filteredQuestions.map((question) => (
                <Card
                  key={question.id}
                  ref={(el) => { questionRefs.current[question.id] = el; }}
                  className={`transition-all ${selectedQuestionId === question.id ? "ring-2 ring-primary shadow-lg" : ""}`}
                  id={`question-${question.id}`}
                >
                  <CardHeader className="flex flex-col items-start gap-2 pb-3">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" color={difficultyColor[question.difficulty]} variant="flat">
                        {difficultyText[question.difficulty]}
                      </Chip>
                      <Chip size="sm" variant="flat" color="default">
                        {categories.find((c) => c.id === question.category)?.name}
                      </Chip>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{question.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="dot" color="primary">{tag}</Chip>
                      ))}
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 题目描述</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: question.content }} />
                    </div>
                    <Divider className="my-4" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 参考答案</h4>
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: question.answer }} />
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
}
