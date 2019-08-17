class UsersController < ApplicationController
  def show
    @user = User.find_by 'nickname ILIKE ?', params['user']
  end

  def edit
  end

  def update
  end

  def delete
  end
end
