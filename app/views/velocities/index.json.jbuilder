json.array!(@velocities) do |velocity|
  json.extract! velocity, :id, :uuid, :garage_num, :t_8am, :t_9am, :t_10am, :t_11am, :t_12pm, :t_1pm, :t_2pm, :t_3pm, :t_4pm, :t_5pm, :t_6pm, :t_7pm, :t_8pm, :t_9pm, :t_10pm_8am
  json.url velocity_url(velocity, format: :json)
end
