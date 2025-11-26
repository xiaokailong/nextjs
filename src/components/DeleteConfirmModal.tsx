"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import type { InterviewQuestion } from '@/types/interview';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  question: InterviewQuestion | null;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  question,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold text-red-600">确认删除</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-gray-700">
              确定要删除这道面试题吗？此操作无法撤销。
            </p>
            {question && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {question.title}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    分类：{question.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    难度：{question.difficulty}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            取消
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={loading}>
            确认删除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
