import React, { useReducer, useEffect, useState, ChangeEvent } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { State, ActionType, Task, SubTask } from './Typescript/Type';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
`;

/**
|--------------------------------------------------
| REDUCER
|--------------------------------------------------
*/

const initialState: State = {
  data: [],
};

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case 'createTask':
      state.data.push(action.payload);
      return { ...state };
    case 'delete':
      const arr1: Task[] = state.data;
      state.data = arr1.filter((value, index) => index !== action.payload);
      return { ...state };
    case 'duplicate':
      const arr2: Task = state.data[action.payload];
      state.data.push(arr2);
      return { ...state };
    case 'addsubtask':
      const arr3 = state;
      const obj: SubTask = {
        name: action.payload.value,
        idDone: false,
      };
      arr3.data[action.payload.index].task.push(obj);
      return { ...arr3 };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [MainTask, setMainTask] = useState<string>('');

  useEffect(() => {
    console.log(state);
  }, [state]);
  /**
  |--------------------------------------------------
  | Main Task
  |--------------------------------------------------
  */

  // Delete Main Task
  const deleteMainTask = (index: number): void => {
    return dispatch({ type: 'delete', payload: index });
  };

  // Duplicate Main Task
  const duplicatemainTask = (index: number): void => {
    return dispatch({ type: 'duplicate', payload: index });
  };

  // Create Main Task (Reducer)
  const createTask = (name: string): void => {
    // console.log(name);
    const data: Task = {
      name: name,
      isAllDone: false,
      task: [],
    };
    dispatch({ type: 'createTask', payload: data });
  };

  // Render Each MainTask
  const MainTaskRender = (): any => {
    const render: any[] = [];
    const data: Task[] = state.data;
    data.map((value, index) => {
      // console.log('checkValue: index', index, value);
      render.push(
        <Space direction="vertical" key={index} style={{ marginTop: 24 }}>
          <Card
            title={value.name}
            style={{ width: 600 }}
            extra={
              <>
                <Button type="primary" onClick={() => duplicatemainTask(index)}>
                  Duplicate
                </Button>{' '}
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteMainTask(index)}
                >
                  Delete
                </Button>
              </>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Input
                  placeholder="Enter Subtask Name"
                  style={{ width: 400 }}
                  id={`input-${index}`}
                />
                <Button type="primary" onClick={() => createSubTask(index)}>
                  Add Subtask
                </Button>
              </Space>
              <Divider />
              {subTaskRender(index)}
            </Space>
          </Card>
        </Space>
      );
    });
    return render.map((value) => value);
  };

  /**
  |--------------------------------------------------
  | Sub Task
  |--------------------------------------------------
  */
  const createSubTask = (index: number): void => {
    const element = document.getElementById(
      'input-' + index
    ) as HTMLInputElement;
    dispatch({
      type: 'addsubtask',
      payload: { index: index, value: element.value },
    });
  };

  const subTaskRender = (index: number): any => {
    const render: any[] = [];
    const data: Task = state.data[index];
    // console.log(data);
    data.task.map((value, index) => {
      render.push(
        <Row key={1}>
          <Col span={16}>
            <Typography.Text>{value.name}</Typography.Text>
          </Col>
          <Col span={8}>
            <Button type="primary">Undo</Button>{' '}
            <Button type="primary" danger>
              Delete
            </Button>
          </Col>
        </Row>
      );
    });
    return render.map((value) => value);
  };

  const TodoExample = (
    <div style={{ paddingTop: '200px' }}>
      <Space direction="vertical" style={{ marginTop: 24 }}>
        <Card
          title="Sample Task"
          style={{ width: 600 }}
          extra={
            <>
              <Button type="primary">Duplicate</Button>{' '}
              <Button type="primary" danger>
                Delete
              </Button>
            </>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input placeholder="Enter Subtask Name" style={{ width: 400 }} />
              <Button type="primary">Add Subtask</Button>
            </Space>
            <Divider />
            <Row>
              <Col span={16}>
                <Typography.Text>Subtask Name (Todo)</Typography.Text>
              </Col>
              <Col span={8}>
                <Button type="primary">Done</Button>{' '}
                <Button type="primary" danger>
                  Delete
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <Typography.Text style={{ textDecoration: 'line-through' }}>
                  Subtask Name (Done)
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Button type="primary">Undo</Button>{' '}
                <Button type="primary" danger>
                  Delete
                </Button>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    </div>
  );
  return (
    <Container>
      <Space>
        <Input
          style={{ width: 400 }}
          placeholder="Enter Task Name"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMainTask(e.target.value)
          }
          value={MainTask}
        />
        <Button type="primary" onClick={() => createTask(MainTask)}>
          Create Task
        </Button>
      </Space>
      {/* {Todo} */}
      {MainTaskRender()}
      {TodoExample}
    </Container>
  );
};

export default App;
