import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

export const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

interface InputProps {
  hasError?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#ff4d4f' : '#d9d9d9'};
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: ${props => props.hasError ? '#ff4d4f' : '#1890ff'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 77, 79, 0.2)' : 'rgba(24, 144, 255, 0.2)'};
  }
`;

export const Button = styled.button`
  padding: 0.75rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #40a9ff;
  }

  &:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.8rem;
  margin: 0.25rem 0;
`; 